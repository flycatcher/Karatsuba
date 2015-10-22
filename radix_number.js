/**
 * @license Copyright (c) 2015, Jun Mei
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function() {
    function parseStringWithRadix(str, radix) {
        var result = [];
        for (var i = str.length - 1; i >= 0; i--) {
            var c = str.charAt(i)
            result.push((+c) % radix);            
        }
        return result;
    }
    
    function RadixNumber(n, radix) {
        this.radix_ = radix;
        
        if (n instanceof Array) {
            this.digits_ = n;
        } else if (typeof n === "string" || n instanceof String) {
            this.digits_ = parseStringWithRadix(n, radix);
        } else {
            this.digits_ = [];
        }
    }

    RadixNumber.prototype = {
        constructor: RadixNumber,
        
        length: function() {
            return this.digits_.length;
        },

        add: function(other) {
            var digits = [];
            
            var myLength = this.length();
            var otherLength = other.length();
            var carry = 0;
            
            for (var i = 0, length = Math.max(myLength, otherLength); i < length; i++) {
                var a = (i < myLength) ? this.digitAt(i) : 0;
                var b = (i < otherLength) ? other.digitAt(i) : 0;
                var c = a + b + carry;

                if (c >= this.radix_) {
                    carry = 1;
                    c = c - this.radix_;
                } else {
                    carry = 0;
                }

                digits.push(c);
            }
            
            if (carry > 0) {
                digits.push(carry);
            }
            
            return new RadixNumber(digits, this.radix_);
        },
        
        subtract: function(other) {
            var digits = this.digits_.slice();
            var i, length;
            
            for (i = 0, length = other.length(); i < length; i++) {
                digits[i] -= other.digitAt(i);
            }
            
            for (i = 0, length = digits.length - 1; i < length; i++) {
                if (digits[i] < 0) {
                    digits[i] += this.radix_;
                    digits[i + 1] -= 1;
                }
            }
            
            i = digits.length;
            
            while (i > 0 && digits[i - 1] == 0) {
                i--;
            }
            
            digits = digits.slice(0, i);
            
            return new RadixNumber(digits, this.radix_);
        },
        
        decompose: function(n) {
            var lower, upper;
            
            if (n >= this.length()) {
                lower = this;
                upper = new RadixNumber([0], this.radix_);
            } else {
                lower = new RadixNumber(this.digits_.slice(0, n), this.radix_);
                upper = new RadixNumber(this.digits_.slice(n), this.radix_);     
            }
           
            return [lower, upper];
        },

        digitAt: function(index) {
            return this.digits_[index];
        },
        
        toString: function() {
            return this.digits_.reverse().join('');
        }
    };

    module.exports = RadixNumber;
})();