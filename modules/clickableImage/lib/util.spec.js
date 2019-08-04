
import { expect } from 'chai';
import * as Util from './util';

describe('Util', () => {
    it('should return mobile and desktop image if argument is a string', () => {
        const arg1 = 'image';
        const isString = Util.getMobileDesktopImages(arg1);
        expect(isString).to.deep.equal({
            mobile: 'image',
            desktop: 'image'
        });
    });

    it('should return mobile and desktop image if argument is an object', () => {
        const arg2 = {
            mobileImage: 'image',
            desktopImage: 'image'
        };
        const isObject = Util.getMobileDesktopImages(arg2);
        expect(isObject).to.deep.equal({
            mobile: 'image',
            desktop: 'image'
        });
    });

    it('should return mobile and desktop color if argument is string', () => {
        const arg1 = 'color';
        const isString = Util.getMobileDesktopColors(arg1);
        expect(isString).to.deep.equal({
            mobile: 'color',
            desktop: 'color'
        });
    });

    it('should return mobile and desktop color if argument is object', () => {
        const arg2 = {
            mobileColor: 'color',
            desktopColor: 'color'
        };
        const isObject = Util.getMobileDesktopColors(arg2);
        expect(isObject).to.deep.equal({
            mobile: 'color',
            desktop: 'color'
        });
    });
});
