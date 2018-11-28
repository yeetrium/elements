import { Base } from '/core/component.js';
import { defaultState } from './states/default.js';
import { uploadingState } from './states/uploading.js';
import { failedState } from './states/failed.js';

const [
  $template,
  $type,
  $endpoint
] = [
  Symbol('template'),
  Symbol('type'),
  Symbol('endpoint')
];

class FileUploader extends Base(HTMLElement, 'FileUploader') {
  static get observedAttributes() { return ['type', 'endpoint']; }
  
  constructor(...args) {
    const self = super(...args);

    this.styles('/file-uploader/file-uploader.css');
    this.template(`
    <div class="file-upload-wrapper">
      ${defaultState}
    </div>
    <div class="file-card-wrapper"></div>`, 
    $template);

    this.formData = new FormData();
    this.type = this.getAttribute('type');
    this.endpoint = this.getAttribute('endpoint');
    this.handleFiles = this.handleFiles.bind(this);
    this.handleClose = this.handleClose.bind(this);

    return self;
  }
  attributeChangedCallback(name, oldValue, newValue) {
    // attach event listener when component first loads, otherwise, attach it in the handleClose fn
    if (newValue === 'upload' && oldValue === null) {
      this.shadowRoot.querySelector('input').addEventListener('change', this.handleFiles);
    }

    if (newValue === 'uploading') {
      this.shadowRoot.querySelector('.file-card-wrapper').addEventListener('click', this.handleClose);
    }
  }
  get type() {
    return this[$type];
  }
  set type(type) {
    if (type === this[$type]) {
      return;
    }

    this[$type] = type;
    this[type ? 'setAttribute' : 'removeAttribute']('type', type);
  }
  get endpoint() {
    return this[$endpoint];
  }
  set endpoint(endpoint) {
    if (endpoint === this[$endpoint]) {
      return;
    }

    this[$endpoint] = endpoint;
    this[endpoint ? 'setAttribute' : 'removeAttribute']('endpoint', endpoint);
  }
  handleFiles(e) {
    const $fileCard = this.shadowRoot.querySelector('.file-card-wrapper');
    this.type = 'uploading';

    const uploading = e.type === 'change';
    let file;

    if (uploading) {
      file = e.target.files[0];
      $fileCard.innerHTML = uploadingState(file.name);
      this.formData.append('file', file);
    } else {
      file = this.formData.get('file');
      $fileCard.innerHTML = uploadingState(file.name);
    }
    
    fetch(this.endpoint, {
      method: 'POST',
      body: this.formData
    })
    .then(res => res.json())
    .then(body => {
      if (!body.ok) {
        this.type = 'failed';
        $fileCard.innerHTML = failedState(file.name);
        this.shadowRoot.querySelector('.retry').addEventListener('click', this.handleFiles);
      }
    });
  }
  handleClose(e) {
    if (e.target.classList.contains('file-card--close')) {
      this.type = 'upload';
      this.shadowRoot.querySelector('.file-card-wrapper').innerHTML = '';
      this.shadowRoot.querySelector('input').addEventListener('change', this.handleFiles);
      this.formData.delete('file');
    }
  }
}

customElements.define('ts-file-uploader', FileUploader);