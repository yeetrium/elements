import { Constants } from '@tradeshift/elements';
import componentMessages from './file-uploader-input.yaml';
export {default as selectors, classNames} from './selectors';

export const Messages = {
	general: Constants.Messages.general,
	...componentMessages
};

export const slotNames = {
	placeholderText: 'placeholder-text',
	buttonText: 'button-text',
	dropText: 'drop-text',

};

export const customEventNames = {
	fileChange: 'change'
};

export const sizes = Constants.sizes;
