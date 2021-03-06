import usa from './i18n/en';
import taiwan from './i18n/zh-TW';
import japan from './i18n/ja';
import korea from './i18n/ko';
import germany from './i18n/de';
import spain from './i18n/es';
import france from './i18n/fr';
import italy from './i18n/it';
import russia from './i18n/ru';

const i18N = {
    'zh-TW': taiwan,
    en: usa,
    ja: japan,
    ko: korea,
    de: germany,
    es: spain,
    fr: france,
    it: italy,
    ru: russia,
};
const DOM = {
    $section: $('.js-channel-card'),
    $sectionTitle: $('.main-section__title'),
    $loadingIcon: $('.channel-card__loader'),
    $imgWrapper: $('.channel-card__img-wrapper'),
};
let language = 'zh-TW';
let region = 'tw';
let h2Title = i18N['zh-TW'].title;
let tokenID = '';
let isLoading = false; // 避免重複發多次 request

function displayVideo(data) {
    let loadContent = '';

    for (let i = 0; i < data.items.length; i += 1) {
        loadContent += `
            <div class="channel-card__item" data-video-id="${data.items[i].id}">
                <div class="channel-card__img-wrapper">
                    <img src="${data.items[i].snippet.thumbnails.high.url}" class="channel-card__img">
                </div>
                <div class="channel-card__content">
                    <h2 class="channel-card__heading">${data.items[i].snippet.title}</h2>
                    <h3 class="channel-card__subheading">${data.items[i].snippet.channelTitle}</h3>
                </div>
            </div>`;
    }

    DOM.$section.append(loadContent);
}

function getVideo() {
    isLoading = true;

    $.ajax({
        url: 'https://www.googleapis.com/youtube/v3/videos',
        data: {
            key: 'AIzaSyBIZ1kKJvH6NIJzefMXGiOd18tr-Bic9Z0',
            part: 'snippet,statistics,topicDetails',
            chart: 'mostPopular',
            hl: language,
            regionCode: region,
            maxResults: 21,
            pageToken: tokenID,
        },
    })
        .done((data) => {
            tokenID = data.nextPageToken;

            if (data.items.length > 0) {
                displayVideo(data);
                isLoading = false;
                DOM.$loadingIcon.hide();
            } else {
                DOM.$loadingIcon.hide();
            }
        });
}

function loadMore() {
    if ($(window).height() + $(window).scrollTop() > $(document).height() - 100) {
        if (!isLoading) {
            DOM.$loadingIcon.show();
            getVideo();
        }
    }
}

function changeLanguage() {
    language = $(this).data('lang');
    region = $(this).data('region');
    h2Title = i18N[`${language}`].title;

    DOM.$sectionTitle.text(h2Title);
    DOM.$section.empty();
    getVideo();
}

$(document).ready(() => {
    getVideo();
    $(window).on('scroll', loadMore);
});

export default {
    changeLanguage: changeLanguage,
};
