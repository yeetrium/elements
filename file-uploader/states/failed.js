export function failedState(filename) {
  return `
  <div class="file-upload-button file-upload-card file-upload--failed">
    <div>
      <span>!</span>
    </div>
    <div>
      <span>Upload failed</span>
      <label>${filename} - </label>
      <span>Retry</span>
    </div>
    <div class="file-upload-card--close">
      <span class="file-upload-card--close">x</span>
    </div>
  </div>`;
}