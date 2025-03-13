"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaleBot = void 0;
var events_1 = require("events");
var connection_1 = require("./Network/connection");
var BaleBot = /** @class */ (function (_super) {
    __extends(BaleBot, _super);
    function BaleBot(BotToken, options) {
        if (options === void 0) { options = { polling_interval: 999 }; }
        var _a;
        var _this = _super.call(this) || this;
        _this.bot_token = BotToken;
        _this.request = new connection_1.Connection(_this.bot_token);
        _this.time = 999;
        _this.poll((_a = options.polling_interval) !== null && _a !== void 0 ? _a : 999);
        return _this;
    }
    BaleBot.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return _super.prototype.emit.apply(this, __spreadArray([event], args, false));
    };
    BaleBot.prototype.on = function (event, listener) {
        return _super.prototype.on.call(this, event, listener);
    };
    BaleBot.prototype.getMe = function () {
        return __awaiter(this, arguments, void 0, function (callback) {
            if (callback === void 0) { callback = function (user) { }; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request.makeConnection("getMe", {}, function (res) {
                            if (callback) {
                                if (res.ok) {
                                    var u = {
                                        id: res.result['id'],
                                        is_bot: res.result['is_bot'],
                                        first_name: res.result['first_name'],
                                        last_name: res.result['last_name'],
                                        username: res.result['username'],
                                        language_code: res.result['language_code']
                                    };
                                    callback(u);
                                }
                            }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BaleBot.prototype.logout = function () {
        return __awaiter(this, arguments, void 0, function (callback) {
            if (callback === void 0) { callback = function (loggingOut) { }; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request.makeConnection("logout", {}, function (res) {
                            if (callback) {
                                if (res.ok) {
                                    callback(res);
                                }
                            }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BaleBot.prototype.close = function () {
        return __awaiter(this, arguments, void 0, function (callback) {
            if (callback === void 0) { callback = function (closing) { }; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request.makeConnection("close", {}, function (res) {
                            if (callback) {
                                if (res.ok) {
                                    callback(res);
                                }
                            }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BaleBot.prototype.sendMessage = function (chatId_1, text_1, options_1) {
        return __awaiter(this, arguments, void 0, function (chatId, text, options, callback) {
            var _, __;
            if (callback === void 0) { callback = function (message) { }; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _ = options.keyboard_mode;
                        __ = {};
                        __[_] = options.reply_markup;
                        return [4 /*yield*/, this.request.makeConnection("sendMessage", {
                                chat_id: chatId,
                                text: text,
                                reply_to_message_id: options.reply_to_message_id,
                                reply_markup: JSON.stringify(__)
                            }, function (res) {
                                if (callback) {
                                    if (res.ok) {
                                        var c = {
                                            id: res.result.chat['id'],
                                            type: res.result.chat['type'],
                                            photo: res.result.chat['photo']
                                        };
                                        var f = {
                                            id: res.result.from['id'],
                                            is_bot: res.result.from['is_bot'],
                                            first_name: res.result.from['first_name'],
                                            last_name: res.result.from['last_name'],
                                            username: res.result.from['username'],
                                            language_code: res.result.from['language_code']
                                        };
                                        var m = {
                                            text: text,
                                            from: f,
                                            id: res.result['message_id'],
                                            date: res.result['date'],
                                            chat: c
                                        };
                                        callback(m);
                                    }
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BaleBot.prototype.forwardMessage = function (chatId_1, options_1) {
        return __awaiter(this, arguments, void 0, function (chatId, options, callback) {
            if (callback === void 0) { callback = function (message) { }; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request.makeConnection("forwardMessage", {
                            from_chat_id: chatId,
                            chat_id: options.to_chat,
                            message_id: options.message_id
                        }, function (res) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14;
                            if (res.ok) {
                                var f = {
                                    id: (_b = (_a = res['result']) === null || _a === void 0 ? void 0 : _a['from']) === null || _b === void 0 ? void 0 : _b['id'],
                                    is_bot: (_d = (_c = res['result']) === null || _c === void 0 ? void 0 : _c['from']) === null || _d === void 0 ? void 0 : _d['is_bot'],
                                    first_name: (_f = (_e = res['result']) === null || _e === void 0 ? void 0 : _e['from']) === null || _f === void 0 ? void 0 : _f['first_name'],
                                    last_name: (_h = (_g = res['result']) === null || _g === void 0 ? void 0 : _g['from']) === null || _h === void 0 ? void 0 : _h['last_name'],
                                    username: (_k = (_j = res['result']) === null || _j === void 0 ? void 0 : _j['from']) === null || _k === void 0 ? void 0 : _k['username'],
                                    language_code: (_m = (_l = res['result']) === null || _l === void 0 ? void 0 : _l['from']) === null || _m === void 0 ? void 0 : _m['language_code'],
                                };
                                var phc = {
                                    big_file_id: (_q = (_p = (_o = res['result']) === null || _o === void 0 ? void 0 : _o['chat']) === null || _p === void 0 ? void 0 : _p['photo']) === null || _q === void 0 ? void 0 : _q['big_file_id'],
                                    big_file_unique_id: (_t = (_s = (_r = res['result']) === null || _r === void 0 ? void 0 : _r['chat']) === null || _s === void 0 ? void 0 : _s['photo']) === null || _t === void 0 ? void 0 : _t['big_file_unique_id'],
                                    small_file_id: (_w = (_v = (_u = res['result']) === null || _u === void 0 ? void 0 : _u['chat']) === null || _v === void 0 ? void 0 : _v['photo']) === null || _w === void 0 ? void 0 : _w['small_file_id'],
                                    small_file_unique_id: (_z = (_y = (_x = res['result']) === null || _x === void 0 ? void 0 : _x['chat']) === null || _y === void 0 ? void 0 : _y['photo']) === null || _z === void 0 ? void 0 : _z['small_file_unique_id'],
                                };
                                var c = {
                                    id: (_1 = (_0 = res['result']) === null || _0 === void 0 ? void 0 : _0['chat']) === null || _1 === void 0 ? void 0 : _1['id'],
                                    first_name: (_3 = (_2 = res['result']) === null || _2 === void 0 ? void 0 : _2['chat']) === null || _3 === void 0 ? void 0 : _3['first_name'],
                                    last_name: (_5 = (_4 = res['result']) === null || _4 === void 0 ? void 0 : _4['chat']) === null || _5 === void 0 ? void 0 : _5['last_name'],
                                    title: (_7 = (_6 = res['result']) === null || _6 === void 0 ? void 0 : _6['chat']) === null || _7 === void 0 ? void 0 : _7['title'],
                                    type: (_9 = (_8 = res['result']) === null || _8 === void 0 ? void 0 : _8['chat']) === null || _9 === void 0 ? void 0 : _9['type'],
                                    invite_link: (_11 = (_10 = res['result']) === null || _10 === void 0 ? void 0 : _10['chat']) === null || _11 === void 0 ? void 0 : _11['invite_link'],
                                    photo: phc
                                };
                                var fm = {
                                    id: (_12 = res['result']) === null || _12 === void 0 ? void 0 : _12['message_id'],
                                    from: f,
                                    date: (_13 = res['result']) === null || _13 === void 0 ? void 0 : _13['date'],
                                    chat: c,
                                    forward_from: f,
                                    forward_date: (_14 = res['result']) === null || _14 === void 0 ? void 0 : _14['forward_date'],
                                    text: undefined
                                };
                                callback(fm);
                            }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BaleBot.prototype.poll = function (intervalTime) {
        return __awaiter(this, void 0, void 0, function () {
            var mesids, clids;
            var _this = this;
            return __generator(this, function (_a) {
                mesids = [];
                clids = [];
                setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                    var evs;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                evs = this.eventNames();
                                if (!(evs.includes("message") ||
                                    evs.includes("photo") ||
                                    evs.includes("video") ||
                                    evs.includes("audio") ||
                                    evs.includes("voice") ||
                                    evs.includes("sticker") ||
                                    evs.includes("document"))) return [3 /*break*/, 2];
                                return [4 /*yield*/, this.request.makeConnection("getUpdates", {}, function (res) {
                                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51;
                                        if (res.ok) {
                                            var indexes = (_a = res['result']) !== null && _a !== void 0 ? _a : [{}];
                                            var last_index = indexes.length - 1;
                                            if (Object.keys(indexes[last_index]).includes("message") === true) {
                                                var last_update = indexes[last_index]['message'];
                                                if (!(last_update['date'] <= Math.max.apply(Math, mesids))) {
                                                    var f = {
                                                        id: (_b = last_update['from']) === null || _b === void 0 ? void 0 : _b['id'],
                                                        is_bot: (_c = last_update['from']) === null || _c === void 0 ? void 0 : _c['is_bot'],
                                                        first_name: (_d = last_update['from']) === null || _d === void 0 ? void 0 : _d['first_name'],
                                                        last_name: (_e = last_update['from']) === null || _e === void 0 ? void 0 : _e['last_name'],
                                                        username: (_f = last_update['from']) === null || _f === void 0 ? void 0 : _f['username'],
                                                        language_code: (_g = last_update['from']) === null || _g === void 0 ? void 0 : _g['language_code']
                                                    };
                                                    var ff = {
                                                        id: (_h = last_update['forward_from']) === null || _h === void 0 ? void 0 : _h['id'],
                                                        is_bot: (_j = last_update['forward_from']) === null || _j === void 0 ? void 0 : _j['is_bot'],
                                                        first_name: (_k = last_update['forward_from']) === null || _k === void 0 ? void 0 : _k['first_name'],
                                                        last_name: (_l = last_update['forward_from']) === null || _l === void 0 ? void 0 : _l['last_name'],
                                                        username: (_m = last_update['forward_from']) === null || _m === void 0 ? void 0 : _m['username'],
                                                        language_code: (_o = last_update['forward_from']) === null || _o === void 0 ? void 0 : _o['language_code']
                                                    };
                                                    var ph = {
                                                        small_file_id: (_q = (_p = last_update['chat']) === null || _p === void 0 ? void 0 : _p['photo']) === null || _q === void 0 ? void 0 : _q['small_file_id'],
                                                        small_file_unique_id: (_s = (_r = last_update['chat']) === null || _r === void 0 ? void 0 : _r['photo']) === null || _s === void 0 ? void 0 : _s['small_file_unique_id'],
                                                        big_file_id: (_u = (_t = last_update['chat']) === null || _t === void 0 ? void 0 : _t['photo']) === null || _u === void 0 ? void 0 : _u['big_file_id'],
                                                        big_file_unique_id: (_w = (_v = last_update['chat']) === null || _v === void 0 ? void 0 : _v['photo']) === null || _w === void 0 ? void 0 : _w['big_file_unique_id']
                                                    };
                                                    var c = {
                                                        id: (_x = last_update['chat']) === null || _x === void 0 ? void 0 : _x['id'],
                                                        first_name: (_y = last_update['chat']) === null || _y === void 0 ? void 0 : _y['first_name'],
                                                        photo: ph,
                                                        type: (_z = last_update['chat']) === null || _z === void 0 ? void 0 : _z['type'],
                                                        title: (_0 = last_update['chat']) === null || _0 === void 0 ? void 0 : _0['title'],
                                                        username: (_1 = last_update['chat']) === null || _1 === void 0 ? void 0 : _1['username'],
                                                        invite_link: (_2 = last_update['chat']) === null || _2 === void 0 ? void 0 : _2['invite_link']
                                                    };
                                                    var d = {
                                                        file_id: (_3 = last_update['document']) === null || _3 === void 0 ? void 0 : _3['file_id'],
                                                        file_unique_id: (_4 = last_update['document']) === null || _4 === void 0 ? void 0 : _4['file_unique_id'],
                                                        file_name: (_5 = last_update['document']) === null || _5 === void 0 ? void 0 : _5['file_name'],
                                                        mime_type: (_6 = last_update['document']) === null || _6 === void 0 ? void 0 : _6['mime_type'],
                                                        file_size: (_7 = last_update['document']) === null || _7 === void 0 ? void 0 : _7['file_size']
                                                    };
                                                    var photos = (_8 = last_update['photo']) !== null && _8 !== void 0 ? _8 : [];
                                                    var phs_1 = [];
                                                    photos.forEach(function (photo) {
                                                        var file_id = photo.file_id, file_unique_id = photo.file_unique_id, width = photo.width, height = photo.height, file_size = photo.file_size;
                                                        phs_1.push({
                                                            file_id: file_id,
                                                            file_unique_id: file_unique_id,
                                                            width: width,
                                                            height: height,
                                                            file_size: file_size
                                                        });
                                                    });
                                                    var video = {
                                                        file_id: (_9 = last_update['video']) === null || _9 === void 0 ? void 0 : _9['file_id'],
                                                        file_unique_id: (_10 = last_update['video']) === null || _10 === void 0 ? void 0 : _10['file_unique_id'],
                                                        width: (_11 = last_update['video']) === null || _11 === void 0 ? void 0 : _11['width'],
                                                        height: (_12 = last_update['video']) === null || _12 === void 0 ? void 0 : _12['height'],
                                                        duration: (_13 = last_update['video']) === null || _13 === void 0 ? void 0 : _13['duration'],
                                                        mime_type: (_14 = last_update['video']) === null || _14 === void 0 ? void 0 : _14['mime_type'],
                                                        file_size: (_15 = last_update['video']) === null || _15 === void 0 ? void 0 : _15['file_size']
                                                    };
                                                    var auv = {
                                                        file_id: (_16 = last_update['audio']) === null || _16 === void 0 ? void 0 : _16['file_id'],
                                                        file_unique_id: (_17 = last_update['audio']) === null || _17 === void 0 ? void 0 : _17['file_unique_id'],
                                                        duration: (_18 = last_update['audio']) === null || _18 === void 0 ? void 0 : _18['duration'],
                                                        mime_type: (_19 = last_update['audio']) === null || _19 === void 0 ? void 0 : _19['mime_type'],
                                                        file_size: (_20 = last_update['audio']) === null || _20 === void 0 ? void 0 : _20['file_size']
                                                    };
                                                    var cont = {
                                                        phone_number: (_21 = last_update['contact']) === null || _21 === void 0 ? void 0 : _21['phone_number'],
                                                        first_name: (_22 = last_update['contact']) === null || _22 === void 0 ? void 0 : _22['first_name'],
                                                        user_id: (_23 = last_update['contact']) === null || _23 === void 0 ? void 0 : _23['user_id']
                                                    };
                                                    var loc = {
                                                        latitude: (_24 = last_update['location']) === null || _24 === void 0 ? void 0 : _24['latitude'],
                                                        longitude: (_25 = last_update['location']) === null || _25 === void 0 ? void 0 : _25['longitude']
                                                    };
                                                    var sticker_thumb = {
                                                        file_id: (_27 = (_26 = last_update['sticker']) === null || _26 === void 0 ? void 0 : _26['thumb']) === null || _27 === void 0 ? void 0 : _27['file_id'],
                                                        file_unique_id: (_29 = (_28 = last_update['sticker']) === null || _28 === void 0 ? void 0 : _28['thumb']) === null || _29 === void 0 ? void 0 : _29['file_unique_id'],
                                                        file_size: (_31 = (_30 = last_update['sticker']) === null || _30 === void 0 ? void 0 : _30['thumb']) === null || _31 === void 0 ? void 0 : _31['file_id'],
                                                        width: (_33 = (_32 = last_update['sticker']) === null || _32 === void 0 ? void 0 : _32['thumb']) === null || _33 === void 0 ? void 0 : _33['width'],
                                                        height: (_35 = (_34 = last_update['sticker']) === null || _34 === void 0 ? void 0 : _34['thumb']) === null || _35 === void 0 ? void 0 : _35['height']
                                                    };
                                                    var stick = {
                                                        file_id: (_36 = last_update['sticker']) === null || _36 === void 0 ? void 0 : _36['file_id'],
                                                        file_unique_id: (_37 = last_update['sticker']) === null || _37 === void 0 ? void 0 : _37['file_unique_id'],
                                                        type: (_38 = last_update['sticker']) === null || _38 === void 0 ? void 0 : _38['type'],
                                                        width: (_39 = last_update['sticker']) === null || _39 === void 0 ? void 0 : _39['width'],
                                                        height: (_40 = last_update['sticker']) === null || _40 === void 0 ? void 0 : _40['height'],
                                                        is_animated: (_41 = last_update['sticker']) === null || _41 === void 0 ? void 0 : _41['is_animated'],
                                                        is_video: (_42 = last_update['sticker']) === null || _42 === void 0 ? void 0 : _42['is_video'],
                                                        thumbnail: sticker_thumb,
                                                        set_name: (_43 = last_update['sticker']) === null || _43 === void 0 ? void 0 : _43['set_name'],
                                                        file_size: (_44 = last_update['sticker']) === null || _44 === void 0 ? void 0 : _44['file_size']
                                                    };
                                                    var left = {
                                                        id: (_45 = last_update['left_chat_member']) === null || _45 === void 0 ? void 0 : _45['id'],
                                                        is_bot: (_46 = last_update['left_chat_member']) === null || _46 === void 0 ? void 0 : _46['is_bot'],
                                                        first_name: (_47 = last_update['left_chat_member']) === null || _47 === void 0 ? void 0 : _47['first_name'],
                                                        last_name: (_48 = last_update['left_chat_member']) === null || _48 === void 0 ? void 0 : _48['last_name'],
                                                        username: (_49 = last_update['left_chat_member']) === null || _49 === void 0 ? void 0 : _49['username'],
                                                        language_code: (_50 = last_update['left_chat_member']) === null || _50 === void 0 ? void 0 : _50['language_code'],
                                                    };
                                                    var news = (_51 = last_update['new_chat_members']) !== null && _51 !== void 0 ? _51 : [];
                                                    var nws_1 = [];
                                                    news.forEach(function (user) {
                                                        var first_name = user.first_name, last_name = user.last_name, id = user.id, username = user.username, language_code = user.language_code, is_bot = user.is_bot;
                                                        nws_1.push({
                                                            first_name: first_name,
                                                            last_name: last_name,
                                                            id: id,
                                                            username: username,
                                                            is_bot: is_bot,
                                                            language_code: language_code
                                                        });
                                                    });
                                                    var m = {
                                                        text: last_update['text'],
                                                        id: last_update['message_id'],
                                                        from: f,
                                                        date: last_update['date'],
                                                        chat: c,
                                                        forward_from: ff,
                                                        forward_from_message_id: last_update['forward_from_message_id'],
                                                        edit_date: last_update['edit_date'],
                                                        document: d,
                                                        photo: phs_1,
                                                        video: video,
                                                        audio: auv,
                                                        voice: auv,
                                                        caption: last_update['caption'],
                                                        contact: cont,
                                                        location: loc,
                                                        sticker: stick,
                                                        left_chat_member: left,
                                                        new_chat_members: nws_1
                                                    };
                                                    if (evs.includes("message")) {
                                                        mesids.push(last_update['date']);
                                                        _this.emit("message", m);
                                                    }
                                                    if (evs.includes("photo")) {
                                                        if (m.photo.length > 0) {
                                                            mesids.push(last_update['date']);
                                                            _this.emit("photo", m);
                                                        }
                                                    }
                                                    if (evs.includes("video")) {
                                                        if (video.file_id !== undefined) {
                                                            mesids.push(last_update['date']);
                                                            _this.emit("video", m);
                                                        }
                                                    }
                                                    if (evs.includes("sticker")) {
                                                        if (m.sticker.file_id !== undefined) {
                                                            mesids.push(last_update['date']);
                                                            _this.emit("sticker", m);
                                                        }
                                                    }
                                                    if (evs.includes("audio")) {
                                                        if (m.audio.file_id !== undefined) {
                                                            mesids.push(last_update['date']);
                                                            _this.emit("audio", m);
                                                        }
                                                    }
                                                    if (evs.includes("voice")) {
                                                        if (m.voice.file_id !== undefined) {
                                                            mesids.push(last_update['date']);
                                                            _this.emit("voice", m);
                                                        }
                                                    }
                                                    if (evs.includes("document")) {
                                                        if (m.document.file_id !== undefined) {
                                                            mesids.push(last_update['date']);
                                                            _this.emit("document", m);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    })];
                            case 1:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 2:
                                if (!evs.includes("callback_query")) return [3 /*break*/, 4];
                                return [4 /*yield*/, this.request.makeConnection("getUpdates", {}, function (res) {
                                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21;
                                        if (res.ok) {
                                            var indexes = (_a = res['result']) !== null && _a !== void 0 ? _a : [{}];
                                            var last_index = indexes.length - 1;
                                            if (Object.keys(indexes[last_index]).includes("callback_query") === true) {
                                                var last_update = indexes[last_index]['callback_query'];
                                                if (!(clids.includes(last_update['id']))) {
                                                    var f = {
                                                        id: (_b = last_update['from']) === null || _b === void 0 ? void 0 : _b['id'],
                                                        is_bot: (_c = last_update['from']) === null || _c === void 0 ? void 0 : _c['is_bot'],
                                                        first_name: (_d = last_update['from']) === null || _d === void 0 ? void 0 : _d['first_name'],
                                                        last_name: (_e = last_update['from']) === null || _e === void 0 ? void 0 : _e['last_name'],
                                                        username: (_f = last_update['from']) === null || _f === void 0 ? void 0 : _f['username'],
                                                        language_code: (_g = last_update['from']) === null || _g === void 0 ? void 0 : _g['language_code']
                                                    };
                                                    var fm = {
                                                        id: (_j = (_h = last_update['message']) === null || _h === void 0 ? void 0 : _h['from']) === null || _j === void 0 ? void 0 : _j['id'],
                                                        is_bot: (_l = (_k = last_update['message']) === null || _k === void 0 ? void 0 : _k['from']) === null || _l === void 0 ? void 0 : _l['is_bot'],
                                                        first_name: (_o = (_m = last_update['message']) === null || _m === void 0 ? void 0 : _m['from']) === null || _o === void 0 ? void 0 : _o['first_name'],
                                                        last_name: (_q = (_p = last_update['message']) === null || _p === void 0 ? void 0 : _p['from']) === null || _q === void 0 ? void 0 : _q['last_name'],
                                                        username: (_s = (_r = last_update['message']) === null || _r === void 0 ? void 0 : _r['from']) === null || _s === void 0 ? void 0 : _s['username'],
                                                        language_code: (_u = (_t = last_update['message']) === null || _t === void 0 ? void 0 : _t['from']) === null || _u === void 0 ? void 0 : _u['language_code']
                                                    };
                                                    var cmPhoto = {
                                                        big_file_id: (_x = (_w = (_v = last_update['message']) === null || _v === void 0 ? void 0 : _v['chat']) === null || _w === void 0 ? void 0 : _w['photo']) === null || _x === void 0 ? void 0 : _x['big_file_id'],
                                                        big_file_unique_id: (_0 = (_z = (_y = last_update['message']) === null || _y === void 0 ? void 0 : _y['chat']) === null || _z === void 0 ? void 0 : _z['photo']) === null || _0 === void 0 ? void 0 : _0['big_file_unique_id'],
                                                        small_file_id: (_3 = (_2 = (_1 = last_update['message']) === null || _1 === void 0 ? void 0 : _1['chat']) === null || _2 === void 0 ? void 0 : _2['photo']) === null || _3 === void 0 ? void 0 : _3['small_file_id'],
                                                        small_file_unique_id: (_6 = (_5 = (_4 = last_update['message']) === null || _4 === void 0 ? void 0 : _4['chat']) === null || _5 === void 0 ? void 0 : _5['photo']) === null || _6 === void 0 ? void 0 : _6['small_file_unique_id']
                                                    };
                                                    var cm = {
                                                        id: (_8 = (_7 = last_update['message']) === null || _7 === void 0 ? void 0 : _7['chat']) === null || _8 === void 0 ? void 0 : _8['id'],
                                                        first_name: (_10 = (_9 = last_update['message']) === null || _9 === void 0 ? void 0 : _9['chat']) === null || _10 === void 0 ? void 0 : _10['first_name'],
                                                        photo: cmPhoto,
                                                        type: (_12 = (_11 = last_update['message']) === null || _11 === void 0 ? void 0 : _11['chat']) === null || _12 === void 0 ? void 0 : _12['type'],
                                                        title: (_14 = (_13 = last_update['message']) === null || _13 === void 0 ? void 0 : _13['chat']) === null || _14 === void 0 ? void 0 : _14['title'],
                                                        username: (_16 = (_15 = last_update['message']) === null || _15 === void 0 ? void 0 : _15['chat']) === null || _16 === void 0 ? void 0 : _16['username'],
                                                        invite_link: (_18 = (_17 = last_update['message']) === null || _17 === void 0 ? void 0 : _17['chat']) === null || _18 === void 0 ? void 0 : _18['invite_link']
                                                    };
                                                    var m = {
                                                        id: (_19 = last_update['message']) === null || _19 === void 0 ? void 0 : _19['message_id'],
                                                        text: (_20 = last_update['message']) === null || _20 === void 0 ? void 0 : _20['text'],
                                                        from: fm,
                                                        date: (_21 = last_update['message']) === null || _21 === void 0 ? void 0 : _21['date'],
                                                        chat: cm
                                                    };
                                                    var cq = {
                                                        id: last_update['id'],
                                                        from: f,
                                                        message: m,
                                                        inline_message_id: last_update['inline_message_id'],
                                                        chat_instance: last_update['chat_instance'],
                                                        data: last_update['data']
                                                    };
                                                    clids.push(last_update['id']);
                                                    _this.emit("callback_query", cq);
                                                }
                                            }
                                        }
                                    })];
                            case 3:
                                _a.sent();
                                _a.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                }); }, intervalTime !== null && intervalTime !== void 0 ? intervalTime : this.time);
                return [2 /*return*/];
            });
        });
    };
    return BaleBot;
}(events_1.EventEmitter));
exports.BaleBot = BaleBot;
// const bot = new BaleBot("1541141536:UqPXqR7Lus8yI4M9QsMMFWwiVpk1W4rbTyoOiuxp", { polling_interval: 999 });
// bot.forwardMessage(
//     554324725,
//     {
//         to_chat: 554324725,
//         message_id: 172
//     },
//     (msg) => {
//         console.log(msg)
//     }
// )
module.exports = { BaleBot: BaleBot };
