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
var vid = {
    file_id: "aaaaaaaaa",
    file_unique_id: "bbbbbbbbbb",
    width: 19,
    heigth: 29,
    duration: 1000,
    file_name: "aa.mp4",
    mime_type: "fff"
};
var v = {
    file_id: vid.file_id,
    file_unique_id: vid.file_unique_id,
    width: vid.width,
    height: vid.heigth,
    duration: vid.duration,
    file_name: vid.file_name,
    mime_type: vid.mime_type,
    file_size: vid['file_size']
};
console.log(v);
