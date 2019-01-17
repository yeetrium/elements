import { Base } from '/core/component.js';
import { downloadState } from './states/download.js';
import { uploadingState } from './states/uploading.js';
import { failedState } from './states/failed.js';
import { getFileInfo } from './utils/getFileInfo.js';

const [
  $template,
  $state,
  $fileurl
] = [
    Symbol('template'),
    Symbol('state'),
    Symbol('fileurl')
  ];

class FileCard extends Base(HTMLElement, 'FileCard') {
  static get observedAttributes() {
    return ['state'];
  }

  constructor() {
    super();

    this.styles('/file-card/file-card.css');
    this.template(`
      <div class="file-card-wrapper"></div>`,
    $template);

    this.state = this.getAttribute('state');
    this.fileurl = this.getAttribute('fileurl');
    this.resetFileInfo = this.resetFileInfo.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.showDownloadMessage = this.showDownloadMessage.bind(this);
  }
  attributeChangedCallback(name, oldValue, newValue) {
    const fileInfo = getFileInfo(this.fileurl);

    if (newValue === 'download') {
      this.shadowRoot.querySelector('.file-card-wrapper').innerHTML = downloadState(fileInfo);
      this.shadowRoot.querySelector('.file-card--download').addEventListener('mouseenter', this.showDownloadMessage);
      this.shadowRoot.querySelector('.file-card--download').addEventListener('mouseleave', this.resetFileInfo);
      this.shadowRoot.querySelector('.file-card--download').addEventListener('click', () => {
        this.handleDownload(this.fileurl, fileInfo.name);
      }, false);
    }

    if (newValue === 'uploading') {
      this.shadowRoot.querySelector('.file-card-wrapper').innerHTML = uploadingState(fileInfo.name);
    }

    if (newValue === 'failed') {
      this.shadowRoot.querySelector('.file-card-wrapper').innerHTML = failedState(fileInfo.name);
    }
  }
  get state() {
    return this[$state];
  }
  set state(state) {
    if (state === this[$state]) {
      return;
    }

    this[$state] = state;
    this[state ? 'setAttribute' : 'removeAttribute']('state', state);
  }
  get fileurl() {
    return this[$fileurl];
  }
  set fileurl(fileurl) {
    if (fileurl === this[$fileurl]) {
      return;
    }

    this[$fileurl] = fileurl;
    this[fileurl ? 'setAttribute' : 'removeAttribute']('fileurl', fileurl);
  }
  showDownloadMessage() {
    this.fileType = this.shadowRoot.querySelector('.filetype').innerHTML;
    this.shadowRoot.querySelector('.filetype').innerHTML = '<small class="message">Click to download</span>';
  }
  handleDownload(file, filename) {
    const link = document.createElement('a');
    link.href = file;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  resetFileInfo() {
    this.shadowRoot.querySelector('.filetype').innerHTML = this.fileType;
  }
}

customElements.define('ts-file-card', FileCard);