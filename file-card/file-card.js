import { Base } from '/core/component.js';
import { downloadState } from './states/download.js';
import { uploadingState } from './states/uploading.js';
import { failedState } from './states/failed.js';

const [
  $template,
  $state,
  $file
] = [
    Symbol('template'),
    Symbol('state'),
    Symbol('file')
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
    this.file = this.getAttribute('file');
    this.resetFileInfo = this.resetFileInfo.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.showDownloadMessage = this.showDownloadMessage.bind(this);
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue === 'download') {
      fetch(this.file)
        .then(res => res.blob())
        .then(blob => {
          const filename = this.file.split('/').pop();
          const fileObj = Object.assign(blob, {
            name: filename
          });

          this.shadowRoot.querySelector('.file-card-wrapper').innerHTML = downloadState(fileObj);
          this.shadowRoot.querySelector('.file-card--download').addEventListener('mouseenter', this.showDownloadMessage);
          this.shadowRoot.querySelector('.file-card--download').addEventListener('mouseleave', this.resetFileInfo);
          this.shadowRoot.querySelector('.file-card--download').addEventListener('click', () => {
            this.handleDownload(this.file, filename);
          }, false);
        });
    }

    if (newValue === 'uploading') {
      const filename = this.file.split('/').pop();
      this.shadowRoot.querySelector('.file-card-wrapper').innerHTML = uploadingState(filename);
    }

    if (newValue === 'failed') {
      const filename = this.file.split('/').pop();
      this.shadowRoot.querySelector('.file-card-wrapper').innerHTML = failedState(filename);
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
  get file() {
    return this[$file];
  }
  set file(file) {
    if (file === this[$file]) {
      return;
    }

    this[$file] = file;
    this[file ? 'setAttribute' : 'removeAttribute']('file', file);
  }
  showDownloadMessage() {
    this.fileType = this.shadowRoot.querySelector('.filetype').innerHTML;
    this.shadowRoot.querySelector('.filetype').innerHTML = '<small class="message">Click to download</span>';
  }
  handleDownload(file, filename) {
    const element = document.createElement('a');
    element.setAttribute('href', file);
    element.setAttribute('download', filename);
    element.setAttribute('target', '_blank');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
  resetFileInfo() {
    this.shadowRoot.querySelector('.filetype').innerHTML = this.fileType;
  }
}

customElements.define('ts-file-card', FileCard);