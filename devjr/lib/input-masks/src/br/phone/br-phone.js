'use strict';

var StringMask = require('string-mask');

var maskFactory = require('../../helpers/mask-factory');

var phoneMask8D = {
		countryCode : new StringMask('+00 (00) 0000-0000'),   //with country code
		areaCode    : new StringMask('(00) 0000-0000'),       //with area code
		simple      : new StringMask('0000-0000')             //without area code
	}, phoneMask9D = {
		countryCode : new StringMask('+00 (00) 00000-0000'), //with country code
		areaCode    : new StringMask('(00) 00000-0000'),     //with area code
		simple      : new StringMask('00000-0000')           //without area code
	}, phoneMask0800 = {
		countryCode : null,                                   //N/A
		areaCode    : null,                                   //N/A
		simple      : new StringMask('0000-000-0000')         //N/A, so it's "simple"
	};

var brPhoneMaskOptions = {
	'countryCode': {sliceSize: 13, min: 12, max: 13},
	'areaCode': {sliceSize: 11, min: 10, max: 11},
	'simple': {sliceSize: 9, min: 8, max: 9},
	'all': {sliceSize: 13, min: 8, max: 13}
};

function findOption(attrs) {
	var brPhoneMaskOption = brPhoneMaskOptions.all;

	if (attrs && attrs.uiBrPhoneNumberMask) {
		var maskOption = attrs.uiBrPhoneNumberMask;
		angular.forEach(brPhoneMaskOptions, function(value, key) {
			if (key === maskOption) {
				brPhoneMaskOption = value;
				return;
			}
		});
	}

	return brPhoneMaskOption;
}

module.exports = maskFactory({
	clearValue: function(rawValue, attrs) {
		var brPhoneMaskOption = findOption(attrs);
		return rawValue.toString().replace(/[^0-9]/g, '').slice(0, brPhoneMaskOption.sliceSize);
	},
	format: function(cleanValue) {
		var formattedValue;

		if (cleanValue.indexOf('0800') === 0) {
			formattedValue = phoneMask0800.simple.apply(cleanValue);
		} else if (cleanValue.length < 9) {
			formattedValue = phoneMask8D.simple.apply(cleanValue) || '';
		} else if (cleanValue.length < 10) {
			formattedValue = phoneMask9D.simple.apply(cleanValue);
		} else if (cleanValue.length < 11) {
			formattedValue = phoneMask8D.areaCode.apply(cleanValue);
		} else if (cleanValue.length < 12) {
			formattedValue = phoneMask9D.areaCode.apply(cleanValue);
		} else if (cleanValue.length < 13) {
			formattedValue = phoneMask8D.countryCode.apply(cleanValue);
		} else {
			formattedValue = phoneMask9D.countryCode.apply(cleanValue);
		}

		return formattedValue.trim().replace(/[^0-9]$/, '');
	},
	getModelValue: function(formattedValue, originalModelType) {
		var cleanValue = this.clearValue(formattedValue);
		return originalModelType === 'number' ? parseInt(cleanValue) : cleanValue;
	},
	validations: {
		brPhoneNumber: function(value, view, attrs) {
			var brPhoneMaskOption = findOption(attrs);
			var valueLength = value && value.toString().length;

			//8- 8D without AC
			//9- 9D without AC
			//10- 8D with AC
			//11- 9D with AC and 0800
			//12- 8D with AC plus CC
			//13- 9D with AC plus CC
			return valueLength >= brPhoneMaskOption.min && valueLength <= brPhoneMaskOption.max;
		}
	}
});
