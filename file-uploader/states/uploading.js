export function uploadingState(filename) {
  return `
  <div class="file-upload-card file-upload--uploading">
    <div class="icon">
      <span>&#8593;</span>
    </div>
    <div class="file-upload--info">
      <label>${filename}</label>
      <div class="progress">
        <div class="track"></div>
        <div class="indicator"></div>
      </div>
    </div>
    <div class="file-upload-card--close icon">
      <span class="file-upload-card--close">x</span>
    </div>
  </div>`;
}