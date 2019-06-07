import { Helpers } from '@tradeshift/elements';

export const classNames = {
	fileUploadWrapper: 'file-upload-wrapper',
	dropBox: 'drop',
	draggableInfo: 'draggable-info',
	dragOverState: 'dragover',
	fileUploadButton: 'file-upload-button'
};
console.log('Helpers.classNamesToSelector(classNames)', Helpers.classNamesToSelector(classNames));

const selectors = {
	input: 'input',
	...Helpers.classNamesToSelector(classNames)
};

export default selectors;
