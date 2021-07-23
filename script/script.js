'use strict';

const STICKERS_URL = 'https://5dd3d5ba8b5e080014dc4bfa.mockapi.io/stickers/';

const STICKER_CLOSE_SELECTOR = '.sticker__close';
const STICKER_SELECTOR = '.sticker';
const STICKER_DESCRIPTION_SELECTOR = '.sticker__description';

const stickersForm = $('#stickersForm');
const listStickersElem = $('#listStickers');
const addStikerBtn = $('#addStikerBtn');

const stickerTemplate = $('#stickerTemplate').html();

let stickers = [];


$(addStikerBtn).on('click', onAddBtnClick);
$(listStickersElem).on('click', STICKER_CLOSE_SELECTOR, onStickerCloseClick);
$(listStickersElem).on('focusout', STICKER_SELECTOR, onStickerInputFocusOut);



init();


function onAddBtnClick() {
    createSticker();
}

function onStickerCloseClick(e) {
    deleteSticker(getElemSticker(e.target));
}

function onStickerInputFocusOut(e) {
    changeContentDescription(e.target);
}

function init() {
    fetch(STICKERS_URL)
        .then((resp) => resp.json())
        .then(getListStickers)
        .then(() => renderStickers(stickers));
}

function createSticker() {
    const stickerHtmlEmpty = getStickerHtmlEmpty();

    $(listStickersElem).append(stickerHtmlEmpty);

    let newSticker = {
        description: '',
    };

    fetch(STICKERS_URL, {
            method: 'POST',
            body: JSON.stringify(newSticker),
            headers: {
                'Content-type': 'application/json',
            }
        }).then(resp => resp.json())
        .then((data) => {
            stickers.push(data);
            $(listStickersElem).empty();
            renderStickers(stickers);
        });
}

function deleteSticker(sticker) {
    const idSticker = getIdSticker(sticker);

    $(sticker).remove();

    fetch(STICKERS_URL + idSticker, {
        method: 'DELETE',
    });
}

function changeContentDescription(elem) {
    const idSticker = getIdSticker(elem);
    const sticker = getSticker(elem);
    const description = $(`[data-id="${idSticker}"]`).children(STICKER_DESCRIPTION_SELECTOR).val();

    sticker.description = description.split('\n').join('');

    fetch(STICKERS_URL + idSticker, {
        method: 'PUT',
        body: JSON.stringify(sticker),
        headers: {
            'Content-type': 'application/json',
        }
    });
}

function getListStickers(data) {
    return (stickers = data);
}

function renderStickers(stickers) {
    const listStickersHtml = $.map(stickers, (sticker) => getStickerHtml(sticker)).join('');

    $(listStickersElem).append(listStickersHtml);
}

function getStickerHtml(sticker) {
    return stickerTemplate
        .replace('{{id}}', sticker.id)
        .replace('{{description}}', sticker.description);
}

function getStickerHtmlEmpty() {
    return stickerTemplate
        .replace('{{id}}', '')
        .replace('{{description}}', '');
}

function getIdSticker(elem) {
    const elemSticker = getElemSticker(elem);
    return $(elemSticker).data('id');
}

function getElemSticker(elem) {
    return $(elem).closest(STICKER_SELECTOR);
}

function getSticker(elem) {
    const id = getIdSticker(elem);

    return stickers.find((item) => +item.id === id);
}