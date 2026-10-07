import React, { createContext, useCallback, useContext, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from './theme';

type DialogButton = {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
};

type DialogRequest = {
  title: string;
  message: string;
  buttons: DialogButton[];
  cancelable: boolean;
};

type DialogOptions = { cancelable?: boolean };
type ShowDialog = (title: string, message: string, buttons?: DialogButton[], options?: DialogOptions) => void;

const DialogContext = createContext<ShowDialog | null>(null);

export function useBizDialog() {
  const showDialog = useContext(DialogContext);
  if (!showDialog) throw new Error('BizDialogProvider is missing.');
  return { showDialog };
}

export function BizDialogProvider({ children }: React.PropsWithChildren) {
  const [dialog, setDialog] = useState<DialogRequest | null>(null);
  const showDialog = useCallback<ShowDialog>((title, message, buttons, options) => {
    setDialog({
      title,
      message: message.replace(/^\s*(?:\[[^\]]+\]\s*)+/, '').trim() || 'Please try again.',
      buttons: buttons?.length ? buttons : [{ text: 'OK' }],
      cancelable: options?.cancelable !== false,
    });
  }, []);

  function choose(button?: DialogButton) {
    setDialog(null);
    button?.onPress?.();
  }

  const cancelButton = dialog?.buttons.find(button => button.style === 'cancel');

  return (
    <DialogContext.Provider value={showDialog}>
      {children}
      <Modal
        visible={dialog !== null}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => {
          if (dialog?.cancelable !== false) choose(cancelButton);
        }}
      >
        <View style={styles.scrim}>
          {dialog && (
            <View accessibilityViewIsModal style={styles.card}>
              <Text accessibilityRole="header" style={styles.title}>{dialog.title}</Text>
              <Text selectable style={styles.message}>{dialog.message}</Text>
              <View style={[styles.actions, dialog.buttons.length === 1 && styles.singleAction]}>
                {dialog.buttons.map((button, index) => {
                  const cancel = button.style === 'cancel';
                  const destructive = button.style === 'destructive';
                  return (
                    <Pressable
                      key={button.text + '-' + index}
                      accessibilityRole="button"
                      onPress={() => choose(button)}
                      style={({ pressed }) => [
                        styles.button,
                        cancel && styles.cancelButton,
                        destructive && styles.destructiveButton,
                        !cancel && !destructive && styles.primaryButton,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text style={[styles.buttonText, destructive && styles.destructiveText]}>{button.text}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      </Modal>
    </DialogContext.Provider>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: 'rgba(39, 53, 44, 0.58)', justifyContent: 'center', alignItems: 'center', padding: 22 },
  card: { width: '100%', maxWidth: 420, padding: 22, gap: 16, borderRadius: 24, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.background, shadowColor: colors.ink, shadowOpacity: 0.2, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 12 },
  title: { color: colors.ink, fontSize: 20, lineHeight: 26, fontWeight: '800', textAlign: 'center' },
  message: { color: colors.muted, fontSize: 15, lineHeight: 22, textAlign: 'center' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 2 },
  singleAction: { flexDirection: 'row', justifyContent: 'center' },
  button: { minHeight: 50, minWidth: 118, flexGrow: 0, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 15, borderWidth: 1.5, borderBottomWidth: 4 },
  primaryButton: { backgroundColor: colors.yellow, borderColor: colors.yellowEdge },
  cancelButton: { backgroundColor: colors.surface, borderColor: colors.line },
  destructiveButton: { backgroundColor: colors.pink, borderColor: colors.error },
  buttonText: { color: colors.ink, fontSize: 14, fontWeight: '800', textAlign: 'center' },
  destructiveText: { color: colors.error },
  pressed: { opacity: 0.76, transform: [{ translateY: 2 }] },
});
