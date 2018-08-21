const input = document.getElementsByTagName('input')[0],
	operatorsBlock = document.getElementsByClassName('operators')[0],
	numbersBlock = document.getElementsByClassName('numbers')[0],
	resultBlock = document.getElementsByClassName('finalResult')[0],
	operators = ['+', '-', '/', '*', '.'];

const compose = (...functions) => value =>
	functions.reduceRight((previousFunction, currentFunction) => currentFunction(previousFunction), value);

operatorsBlock.onclick = event => {
	const target = event.target,
		operator = target.innerText,
		inputValue = input.value;
	
	switch(target.className) {
		case 'add':
		case 'multiply':
		case 'divide':
			compose(
				passValueInInput,
				validateAddMultiplyDivide
			)(operator);
			
			break;
		case 'subtract':
			compose(
				passValueInInput,
				validateSubtractDot
			)(operator);
			
			break;
		case 'dot':
			compose(
				passValueInInput,
				validateSubtractDot,
				isDotInNumber
			)(inputValue);

			break;
		case 'remove':
			compose(
				pasteResult,
				roundAndFormatResult,
				validateResult,
				passValueInInput,
				cutValue
			)(inputValue);
			
			break;
	}
};

numbersBlock.onclick = event => {
	const target = event.target;
	
	if (target.tagName === 'BUTTON') {
		compose(
			pasteResult,
			roundAndFormatResult,
			passValueInInput,
			updateValue
		)(target.innerText);
	}
};

const validateAddMultiplyDivide = operator => {
	let inputValue = input.value;
	const inputValueLast = inputValue.slice(-1),
		valueLength = inputValue.length;
	
	if (valueLength >= 1 && !operators.includes(inputValueLast)) {
		return updateValue(operator);
	} else if (valueLength > 1 && operators.includes(inputValueLast)) {
		return changeOperator(operator);
	} return inputValue;
};

const validateSubtractDot = operator => {
	let inputValue = input.value;
	const inputValueLast = inputValue.slice(-1),
		valueLength = inputValue.length;
	
	if (operator) {
		if (!valueLength || (valueLength >= 1 && !operators.includes(inputValueLast))) {
			return updateValue(operator);
		} else if (valueLength >= 1 && operators.includes(inputValueLast)) {
			return changeOperator(operator);
		}
	} return inputValue;
};

const isDotInNumber = expression => {
	if (expression) {
		const numbersArr = expression.split(/[-+*/]/),
			lastEl = numbersArr[numbersArr.length-1] || numbersArr[numbersArr.length-2];
		
		return lastEl.split('.')[1] ? '' : '.';
	} return '.';
};

const updateValue = value => input.value += value;

const changeOperator = operator => input.value.slice(0, -1) + operator;

const cutValue = value => value.slice(0, -1);

const passValueInInput = value => input.value = value;

const validateResult = value => {
	if (!value || value === '-' || value === '.') {
		return 0;
	} else if (operators.includes(value.slice(-1))) {
		return value.slice(0, -1);
	} return value;
};

const roundAndFormatResult = result => +((Math.round(eval(result) / 0.0001) * 0.0001).toFixed(4)).toString();

const pasteResult = result => resultBlock.innerText = result === Infinity ? 'Нельзя делить на 0' : result;