import { Base } from '/core/component.js';
import { defaultState } from './states/default.js';
import { uploadingState } from './states/uploading.js';

const [
  $template,
  $type
] = [
  Symbol('template'),
  Symbol('type')
];

class FileUploader extends Base(HTMLElement, 'FileUploader') {
  static get observedAttributes() { return ['type']; }
  
  constructor(...args) {
    const self = super(...args);

    this.styles('/file-uploader/file-uploader.css');
    this.template(`
    <div class="file-upload-wrapper">
      ${defaultState}
    </div>`, $template);

    this.type = this.getAttribute('type');
    this.handleFiles = this.handleFiles.bind(this);

    return self;
  }
  connectedCallback() {
    this.shadowRoot.querySelector('input').addEventListener('change', this.handleFiles);
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue === 'uploading') {
      this.shadowRoot.querySelector('.file-upload-wrapper').addEventListener('click', this.handleClose);
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
  handleFiles(e) {
    this.type = 'uploading';
    this.shadowRoot.querySelector('.file-upload-wrapper')
      .innerHTML = uploadingState(e.target.files[0].name);
  }
  handleClose(e) {
    if (e.target.classList.contains('file-upload-card--close')) {
      this.innerHTML = defaultState;
    }
  }
}

customElements.define('ts-file-uploader', FileUploader);