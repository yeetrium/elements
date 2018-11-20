export function uploadingState(filename) {
  return `
  <div class="file-upload-button file-upload-card file-upload--uploading">
    <div>
      <span>&#8593;</span>
    </div>
    <label>${filename}</label>
    <div class="file-upload-card--close">
      <span class="file-upload-card--close">x</span>
    </div>
  </div>`;
}