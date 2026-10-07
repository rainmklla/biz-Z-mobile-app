const { withAppBuildGradle, withSettingsGradle } = require('expo/config-plugins');

const marker = '// Short native paths for Windows builds';
const block = `
${marker}
android {
    externalNativeBuild {
        cmake {
            buildStagingDirectory file("../../.cxx")
        }
    }
    defaultConfig {
        externalNativeBuild {
            cmake {
                arguments "-DCMAKE_OBJECT_PATH_MAX=259"
            }
        }
    }
}
`;

function patchGradle(contents) {
  return contents.includes(marker) ? contents : `${contents.trimEnd()}\n${block}`;
}

module.exports = function withShortNativePaths(config) {
  config = withAppBuildGradle(config, config => {
    if (config.modResults.language !== 'groovy') {
      throw new Error('withShortNativePaths requires a Groovy app/build.gradle.');
    }
    config.modResults.contents = patchGradle(config.modResults.contents);
    return config;
  });

  return withSettingsGradle(config, config => {
    if (config.modResults.language !== 'groovy') {
      throw new Error('withShortNativePaths requires a Groovy settings.gradle.');
    }

    const projectName = (config.slug || 'business-plan-builder').replace(/[^a-zA-Z0-9_-]/g, '-');
    const settings = config.modResults.contents.replace(
      /rootProject\.name\s*=\s*(['"]).*?\1/,
      `rootProject.name = '${projectName}'`,
    );

    if (settings === config.modResults.contents) {
      throw new Error('Could not find rootProject.name in settings.gradle.');
    }

    config.modResults.contents = settings;
    return config;
  });
};

module.exports.patchGradle = patchGradle;
