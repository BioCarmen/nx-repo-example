import { releaseVersion, releaseChangelog } from 'nx/release';

const COMMIT_HASH = process.argv[2];

(async () => {
  console.log(`Running nx release on git hash ${COMMIT_HASH}`);

  try {
    const { workspaceVersion } = await releaseVersion({
      dryRun: false,
      verbose: true,
      gitCommit: false,
      gitTag: true,
      generatorOptionsOverrides: {
        updateDependents: 'auto',
      },
    });

    // console.log('versionOutput', JSON.stringify(versionOutput, null, 4));
    console.log('workspaceVersion', workspaceVersion);

    // after successful publish we tag the commit with last-release and push the tags created by nx version
    await executeCommand(
      `git tag -f last-release ${COMMIT_HASH} && git push origin last-release --force && git push --tags`,
      'Pushed last-release tag and pushed tags for each published package',
      'Failed to push last-release tag, or failed to push tags for each published package'
    );
    // const changelogOutput = await releaseChangelog({});
  } catch (err) {
    console.log('nx release failed with error', err);
  }
})();

export async function executeCommand(
  command: string,
  successMessage?: string,
  failureMessage?: string,
  showConsoleOutput = true
): Promise<string> {
  const { exec } = await import('child_process');
  return new Promise((resolve, reject) => {
    const childProcess = exec(command, (error, stdout, _stderr) => {
      if (error) {
        const errorMessage = failureMessage
          ? `${failureMessage}: ${error.message}`
          : error.message;
        console.error(errorMessage);
        reject(errorMessage);
        return;
      }
      if (successMessage) {
        console.log(successMessage);
      }
      resolve(stdout.trim());
    });
    if (showConsoleOutput) {
      childProcess.stdout!.on('data', (data) => {
        console.log(data.toString());
      });
    }
  });
}
