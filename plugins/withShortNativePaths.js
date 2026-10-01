const { withAppBuildGradle } = require('expo/config-plugins');

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
  return withAppBuildGradle(config, config => {
    if (config.modResults.language !== 'groovy') {
      throw new Error('withShortNativePaths requires a Groovy app/build.gradle.');
    }
    config.modResults.contents = patchGradle(config.modResults.contents);
    return config;
  });
};

module.exports.patchGradle = patchGradle;
