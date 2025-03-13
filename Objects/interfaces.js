"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaskText = void 0;
var MaskText = /** @class */ (function () {
    function MaskText(text) {
        this.text = text;
    }
    MaskText.prototype.bold = function () {
        return "*".concat(this.text, "*");
    };
    MaskText.prototype.italic = function () {
        return "_".concat(this.text, "_");
    };
    MaskText.prototype.createLink = function (link) {
        return "[".concat(this.text, "](").concat(link, ")");
    };
    MaskText.prototype.createDocumentation = function (object) {
        return "```" + "[".concat(this.text, "]").concat(object) + "```";
    };
    return MaskText;
}());
exports.MaskText = MaskText;
module.exports = { MaskText: MaskText };
