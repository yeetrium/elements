import { Base } from '/core/component.js';
import { defaultState } from './states/default.js';
import { uploadingState } from './states/uploading.js';
import { uploadFile } from './utils/uploadFile.js';
import { calcFileSize } from './utils/calcFileSize.js';
import { validateFileType } from './utils/validateFileType.js';

const [
  $template,
  $state,
  $endpoint,
  $maxfilesize,
  $filetypes
] = [
  Symbol('template'),
  Symbol('state'),
  Symbol('endpoint'),
  Symbol('maxfilesize'),
  Symbol('filetypes')
];

class FileUploader extends Base(HTMLElement, 'FileUploader') {
  static get observedAttributes() {
    return ['state', 'endpoint', 'filetypes']; 
  }
  
  constructor() {
    super();
    this.filetypes = this.getAttribute('filetypes');

    this.styles('/file-uploader/file-uploader.css');
    this.template(`
    <div class="file-upload-wrapper drop">
      ${defaultState(this.filetypes)}
    </div>
    <div class="file-card-wrapper"></div>`, 
    $template);

    this.fileType;
    this.dragCounter = 0;
    this.formData = new FormData();
    this.state = this.getAttribute('state');
    this.endpoint = this.getAttribute('endpoint');
    this.maxfilesize = this.getAttribute('maxfilesize');
    this.handleClose = this.handleClose.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.resetFileFormats = this.resetFileFormats.bind(this);
    this.dragEnterHandler = this.dragEnterHandler.bind(this);
    this.dragOverHandler = this.dragOverHandler.bind(this);
    this.dragLeaveHandler = this.dragLeaveHandler.bind(this);
    this.dropHandler = this.dropHandler.bind(this);
    this.fileUploadWrapper = this.shadowRoot.querySelector('.file-upload-wrapper');
  }
  attributeChangedCallback(name, oldValue, newValue) {
    // attach event listener when component first loads, otherwise, attach it in the handleClose fn
    if (newValue === 'upload' && oldValue === null) {
      this.shadowRoot.querySelector('input').addEventListener('change', this.handleUpload);
      this.fileUploadWrapper.addEventListener('dragenter', this.dragEnterHandler, false);
      this.fileUploadWrapper.addEventListener('dragover', this.dragOverHandler, false);
      this.fileUploadWrapper.addEventListener('dragleave', this.dragLeaveHandler, false);
      this.fileUploadWrapper.addEventListener('drop', this.dropHandler, false);
    }

    if (newValue === 'uploading') {
      this.shadowRoot.querySelector('.file-card-wrapper').addEventListener('click', this.handleClose);
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
  get filetypes() {
    return this[$filetypes];
  }
  set filetypes(filetypes) {
    if (filetypes === this[$filetypes]) {
      return;
    }

    this[$filetypes] = filetypes;
    this[filetypes ? 'setAttribute' : 'removeAttribute']('filetypes', filetypes);
  }
  get maxfilesize() {
    return this[$maxfilesize];
  }
  set maxfilesize(maxfilesize) {
    if (maxfilesize === this[$maxfilesize]) {
      return;
    }

    this[$maxfilesize] = maxfilesize;
    this[maxfilesize ? 'setAttribute' : 'removeAttribute']('maxfilesize', maxfilesize);
  }
  handleUpload(e) {
    const $fileCard = this.shadowRoot.querySelector('.file-card-wrapper');
    this.state = 'uploading';

    const uploading = e.type === 'change';
    let file;

    if (uploading) {
      file = e.target.files[0];
      if (calcFileSize(file, this.maxfilesize).tooLarge) return;
      
      $fileCard.innerHTML = uploadingState(file.name);
      this.formData.append('file', file);
    } else {
      file = this.formData.get('file');
      $fileCard.innerHTML = uploadingState(file.name);
    }
    
    uploadFile(this, $fileCard, file);
    this.resetFileFormats();
  }
  handleClose(e) {
    if (e.target.classList.contains('file-card--close')) {
      this.state = 'upload';
      this.shadowRoot.querySelector('.file-card-wrapper').innerHTML = '';
      this.shadowRoot.querySelector('input').addEventListener('change', this.handleUpload);
      this.formData.delete('file');
    }
  }
  handleDownload() {
    this.fileType = this.shadowRoot.querySelector('.filetype').innerHTML;
    this.shadowRoot.querySelector('.filetype').innerHTML = '<small class="message">Click to download</span>';
  }
  resetFileFormats() {
    this.shadowRoot.querySelector('.file-formats').style.color = '#565656';
    this.shadowRoot.querySelector('.info-icon').style.fill = '#00B0FF';
  }
  dragEnterHandler(e) {
    e.preventDefault();
    this.dragCounter++;
    if (this.dragCounter > 0) {
      this.fileUploadWrapper.classList.add('dragover');
    }
  }
  dragOverHandler(e) {
    e.preventDefault();
  }
  dragLeaveHandler(e) {
    e.preventDefault();
    this.dragCounter--;
    if (this.dragCounter === 0) {
      this.fileUploadWrapper.classList.remove('dragover');
    }
  }
  dropHandler(e) {
    e.preventDefault();
    this.fileUploadWrapper.classList.remove('dragover');
    const dt = e.dataTransfer;
    const files = dt.files;
    const isValidFileType = validateFileType(files[0], this.filetypes);    

    if (isValidFileType) {
      const event = {
        type: 'change',
        target: {
          files
        }
      };
      this.handleUpload(event);
      this.resetFileFormats();
    } else {
      this.shadowRoot.querySelector('.file-formats').style.color = '#FF1744';
      this.shadowRoot.querySelector('.info-icon').style.fill = '#FF1744';
    }
  }
}
customElements.define('ts-file-uploader', FileUploader);