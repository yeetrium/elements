import { failedState } from '../states/failed.js';
import { downloadState } from '../states/download.js';

export function uploadFile(uploader, $fileCard, file) {
  fetch(uploader.endpoint, {
    method: 'POST',
    body: uploader.formData
  })
    .then(res => res.json())
    .then(body => {
      if (body.ok) {
        uploader.state = 'download';
        $fileCard.innerHTML = downloadState(file);
        uploader.shadowRoot.querySelector('.file-card--download').addEventListener('mouseenter', uploader.handleDownload);
        uploader.shadowRoot.querySelector('.file-card--download').addEventListener('mouseleave', uploader.resetFileInfo);
      }

      if (!body.ok) {
        uploader.state = 'failed';
        $fileCard.innerHTML = failedState(file.name);
        uploader.shadowRoot.querySelector('.retry').addEventListener('click', uploader.handleUpload);
      }
    }).catch(err => {
      if (err) {
        uploader.state = 'failed';
        $fileCard.innerHTML = failedState(file.name);
        uploader.shadowRoot.querySelector('.retry').addEventListener('click', uploader.handleUpload);
      }
    });
}