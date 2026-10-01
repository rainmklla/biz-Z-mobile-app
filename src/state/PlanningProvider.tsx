import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useBusinessApp } from '../../App';
import { emptyPlan, parsePlan, type Plan } from '../data/plan';
import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from '@react-native-firebase/firestore';

type PlanningState = { plan: Plan; ready: boolean; error: string; update: (change: (old: Plan) => Plan) => Promise<void>; backup: () => Promise<void>; restore: () => Promise<void> };
const Context = createContext<PlanningState | null>(null);
export function usePlanning() { const value = useContext(Context); if (!value) throw new Error('Planning provider is missing.'); return value; }
export function PlanningProvider({ children }: React.PropsWithChildren) {
  const app = useBusinessApp();
  const uid = app.user?.uid;
  const workspace = app.selectedBusiness?.workspaceId;
  return <Session key={`${uid}:${workspace}`} uid={uid} workspace={workspace}>{children}</Session>;
}
function Session({ children, uid, workspace }: React.PropsWithChildren<{ uid?: string; workspace?: string }>) {
  const [plan, setPlan] = useState(emptyPlan);
  const [ready, setReady] = useState(!uid || !workspace);
  const [error, setError] = useState('');
  const current = useRef(plan);
  const active = useRef(true);
  const queue = useRef(Promise.resolve());
  const key = uid && workspace ? `bizz-plan-v1:${uid}:${workspace}` : null;
  // Dynamic import lets older development builds show a useful message instead of crashing at startup.
  async function storage() { return (await import('@react-native-async-storage/async-storage')).default; }
  useEffect(() => {
    active.current = true;
    if (!key) return () => { active.current = false; };
    void storage().then(s => s.getItem(key)).then(raw => {
      if (!active.current) return;
      const loaded = raw ? parsePlan(raw) : emptyPlan();
      current.current = loaded; setPlan(loaded); setReady(true);
    }).catch(() => { if (active.current) setError('Could not open device drafts. If you just updated the app, rebuild the development app to enable draft storage. Your existing data has not been overwritten.'); });
    return () => { active.current = false; };
  }, [key]);
  function update(change: (old: Plan) => Plan) {
    const task = queue.current.then(async () => {
      if (!active.current || !key || !ready) throw new Error('Select a business and wait for your drafts to load.');
      const next = change(current.current);
      parsePlan(JSON.stringify(next));
      await (await storage()).setItem(key, JSON.stringify(next));
      if (active.current) { current.current = next; setPlan(next); }
    });
    queue.current = task.catch(() => {});
    return task;
  }
  function reference() {
    if (!uid || !workspace) throw new Error('Choose a business first.');
    return doc(getFirestore(), 'users', uid, 'planBackups', workspace);
  }
  async function backup() {
    await queue.current;
    const payload = JSON.stringify(current.current);
    if (payload.length > 200000) throw new Error('This plan is too large for a cloud backup. Your full history is still saved on this device; export your plan as PDF.');
    try { await setDoc(reference(), { payload, updatedAt: serverTimestamp(), schema: 1 }); }
    catch (error) { throw cloudError(error); }
  }
  async function restore() {
    const snapshot = await getDoc(reference()).catch(error => { throw cloudError(error); });
    const payload = snapshot.data()?.payload;
    if (typeof payload !== 'string') throw new Error('No cloud backup exists for this business yet.');
    const restored = parsePlan(payload);
    await update(() => restored);
  }
  return <Context.Provider value={{ plan, ready, error, update, backup, restore }}>{children}</Context.Provider>;
}
function cloudError(error: unknown) {
  if (error && typeof error === 'object' && 'code' in error && String(error.code).includes('permission-denied')) return new Error('Cloud backups are not enabled for this account yet. Publish the planning backup rules in Firebase. Your device drafts are safe.');
  return error instanceof Error ? error : new Error('Cloud backup is unavailable. Please check your connection and try again.');
}
