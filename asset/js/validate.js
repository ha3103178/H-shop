// Validator

//  Đối tượng 'Validator
function Validator(options) {
    function getParent(element, selector) {
        while (element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var selectorRules = {};

    // // Hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        var errorMessage;

        var rules = selectorRules[rule.selector];
        for (var i = 0; i < rules.length; ++i) {
            errorMessage = rules[i](inputElement.value);
            if(errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        } else {
            errorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }

        return !errorMessage;
    }

    // Lấy element form  cần validate
    var formElement = document.querySelector(options.form);
    if (formElement) {
        // Khi submit form
        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isFormValid = true;

            // Lặp qua từng rule và validate
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement, rule);
                if(!isValid) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                // Submit với javascript
                if(typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(enableInputs).reduce(function(values, input) {
                        values[input.name] = input.value;
                        return values;
                    }, {});
                    options.onSubmit(formValues);
                    formElement.submit();
                }
                // Submit với hành vi mặc định
                else {
                    formElement.submit();
                }
            }
        }

        // Lặp qua mỗi rule và xử lý
        options.rules.forEach(function(rule) {

            // Lưu lại các rules cho mỗi input
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            }else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElement = formElement.querySelector(rule.selector);
            if (inputElement) {
                inputElement.onblur = function() {
                    validate(inputElement, rule);
                }

                // Xử lí khi nhập vào input
                inputElement.oninput = function() {
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
                    errorElement.innerText = '';
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                }
            }
        });
    }
}


//  Định nghĩa rules

Validator.isUserName = function (selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này *'
        }
    }
}

Validator.isRequied = function (selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này *'
        }
    }
}

Validator.isNumberPhone = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
            var message;
            if(value !== ''){
                if(vnf_regex.test(value) === false) {
                    message = 'Số điện thoại của bạn không đúng định dạng!'
                }
            }else {
                message = 'Vui lòng điền số điện thoại!'
            }
            return message
        }
    }
}

Validator.isEmail = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/; 
            return regex.test(value) ? undefined : message || 'Trường này phải là email *'
        }
    }
}

Validator.minLength = function(selector, min) {
    return {
        selector: selector,
        test: function (value) {
            return value === '' ? 'Vui lòng nhập mật khẩu' : value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự *`
        }
    }
}

Validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined : message || 'Mật khẩu nhập lại không chính xác'
        }
    }
}

