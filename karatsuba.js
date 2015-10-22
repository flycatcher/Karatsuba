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
    function Karatsuba(x, y, radix) {
        var RadixNumber = require("./radix_number");
        
        if (x.length() < 2 && y.length() < 2) {
            var x0 = x.digitAt(0);
            var y0 = y.digitAt(0);
            return new RadixNumber(x0 * y0, radix);
        }
        
        var n = Math.max(x.length(), y.length()) >> 1;
        var componentsX = x.decompose(n);
        var componentsY = y.decompose(n);
        
        var z2 = Karatsuba(componentsX[1], componentsY[1], radix);
        var z0 = Karatsuba(componentsX[0], componentsY[0], radix);
        
        var sumX = componentsX[1].add(componentsX[0]);
        var sumY = componentsY[1].add(componentsY[0]); 
        var z1 = Karatsuba(sumX, sumY, radix).subtract(z2).subtract(z0);
        
        return z2.shift(2 * n).add(z1.shift(n)).add(z0);
    }
    
    function main() {
        var RadixNumber = require("./radix_number");
        var a = new RadixNumber("12342131934785823475", 10);
        var b = new RadixNumber("28458437581234213", 10);
        var c = Karatsuba(a, b, 10);
        console.log(c.toString());
    }
    
    main();
})();