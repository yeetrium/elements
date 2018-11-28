export function failedState(filename) {
  return `
  <div class="file-upload-card file-upload--failed">
    <div class="icon">
      <span>!</span>
    </div>
    <div>
      <label>Upload failed</label>
      <div class="file-upload--info">
        <small class="filename">${filename} - </small>
        <small class="retry">Retry</small>
      </div>
    </div>
    <div class="file-upload-card--close icon">
      <span class="file-upload-card--close">x</span>
    </div>
  </div>`;
}