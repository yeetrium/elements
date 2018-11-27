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
    </div>`, $template);

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
    this.type = 'uploading';
    
    const file = e.target.files[0];
    this.shadowRoot.querySelector('.file-upload-wrapper').innerHTML = uploadingState(file.name);

    let formData = new FormData();
    formData.append('file', file);

    // fetch(this.endpoint, {
    //   method: 'POST',
    //   body: formData
    // })
    // .then(res => res.json())
    // .then(body => {
    //   if (!body.ok) {
    //     this.type = 'failed';
    //     this.shadowRoot.querySelector('.file-upload-wrapper').innerHTML = failedState(file.name);
    //   }
    // });

    // for (var pair of formData.entries()) {
    //   console.log(pair[0] + ', ' + pair[1]); 
    // }
  }
  handleClose(e) {
    if (e.target.classList.contains('file-upload-card--close')) {
      this.type = 'upload';
      this.shadowRoot.querySelector('.file-upload-wrapper').innerHTML = defaultState;
      this.shadowRoot.querySelector('input').addEventListener('change', this.handleFiles);
    }
  }
}

customElements.define('ts-file-uploader', FileUploader);