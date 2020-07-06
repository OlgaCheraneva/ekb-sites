$(function () {
    // Visitors
    sendTelegramMessage({message: 'You have a visitor on your website'});

    // Header
    const header = $('.header');
    const headerClass = 'header_translucent-bg';

    $(window).on('scroll', function () {
        $(window).scrollTop() > header.outerHeight()
            ? header.addClass(headerClass)
            : header.removeClass(headerClass);
    });

    // Menu
    const menuButton = $('.menu-button');
    const menu = $('.nav');

    menuButton.on('click', handleMenuDisplay);

    function handleMenuDisplay() {
        $(this).toggleClass('open');
        menu.css('display') === 'none'
            ? menu.slideDown(500)
            : menu.slideUp(500);
    }

    const menuBreakpoint = 1024.98;
    const activeClasses = ['nav__link_active', 'bold-on-hover_underlined'];
    handleBoldOnHover();
    $(window).on('resize', handleBoldOnHover);
    let currentWidth, previousWidth;
    function handleBoldOnHover() {
        currentWidth = $(window).width();
        if (currentWidth < menuBreakpoint && previousWidth >= menuBreakpoint) {
            removeActiveClasses();
            $('.nav__link').removeClass('bold-on-hover');
            menu.attr('style', 'display: none;');
            menuButton.removeClass('open');
        }
        if (currentWidth >= menuBreakpoint && previousWidth < menuBreakpoint) {
            $('.nav__link').addClass('bold-on-hover');
            if (menu.attr('style') === 'display: none;') {
                menu.attr('style', '');
            }
        }
        previousWidth = currentWidth;
    }

    $('.nav__link, .footer__nav-link').on('click', handleMenuClick);

    function handleMenuClick(e) {
        e.preventDefault();

        const targetElement = $(this).attr('href');
        const animationSpeed = 500;
        const headerHeight = $('.header').outerHeight();
        const destination = $(targetElement).offset().top - headerHeight;

        reassignActiveClasses(`.nav__link[href="${targetElement}"]`);
        $('html').animate({scrollTop: destination}, animationSpeed);

        return false;
    }

    function reassignActiveClasses(newActiveLink) {
        removeActiveClasses();
        $(newActiveLink).addClass(activeClasses.join(' '));
    }

    function removeActiveClasses() {
        $('.nav__link').removeClass(activeClasses.join(' '));
    }

    // Dialogs
    handleDialog(
        '.call-request-dialog',
        '.open-call-request-dialog',
        '.close-call-request-dialog'
    );
    handleDialog(
        '.contact-form-dialog',
        '.open-contact-form-dialog',
        '.close-contact-form-dialog'
    );
    function handleDialog(dialog, openBtn, closeBtn) {
        $(openBtn).on('click', (e) => {
            e.stopPropagation();
            $(dialog).addClass('dialog_open');
            bodyScrollLock.disableBodyScroll(
                document.querySelector('.dialog_open')
            );
            $(document).on('click', handleOutsideDialogClick);
        });
        $(closeBtn).on('click', closeDialog);
    }
    function handleOutsideDialogClick(e) {
        const dialog = $('.dialog_open .dialog__inner');
        if (!dialog.is(e.target) && dialog.has(e.target).length === 0) {
            closeDialog();
        }
    }
    function closeDialog() {
        bodyScrollLock.enableBodyScroll(document.querySelector('.dialog_open'));
        $('.dialog_open .dialog__form').trigger('reset');
        $('.dialog_open').removeClass('dialog_open');
        $(document).unbind('click', handleOutsideDialogClick);
    }

    // Input mask
    new Inputmask('+7 999 999-99-99').mask($('.phone-number-input'));

    // Forms
    $('.dialog__form').submit(function (event) {
        event.preventDefault();

        const formElem = event.target;
        const formData = {};
        [...formElem.elements].forEach((el) => {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                formData[el.name] = el.value;
            }
        });

        sendTelegramMessage(formData)
            .then(() => alert('Отправлено'))
            .catch((e) => {
                console.error(e);
                alert(
                    'Возникла ошибка. Свяжитесь со мной по номеру +7 950 654 53 55'
                );
            });

        closeDialog();
        $(this).trigger('reset');
    });

    function sendTelegramMessage(formData) {
        // Telegram Message Bot Instruction
        // @botfather
        // START
        // /newbot
        // [name]
        // [name_bot]
        // Get the token
        // Create a new group, add your bot to this group
        // START BOT
        // In group chat: /join @[name_bot]
        // Go: https://api.telegram.org/botXXXXXXXXXXXXXXXXXXXXXXX/getUpdates, xxx... - token
        // Get the id with minus (group chatId)

        const token = '1176307202:AAFMfmvNmFVi2wy2A-2NsIjmgxgtPypsGT4';
        const chatId = '-327278816';
        return fetch(
            `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&parse_mode=html&text=${encodeURI(
                JSON.stringify(formData, null, '\t')
            )}`
        );
    }

    // Carousel
    new Swiper('.swiper-container', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 1,
        navigation: {
            nextEl: '[data-action="slideRight"]',
            prevEl: '[data-action="slideLeft"]',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            520: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            1025: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
        },
    });

    // Prices section animation
    const section = $('.prices');
    const sectionElements = $('.prices__elements');
    const animationClassName = 'prices__elements_animated';

    function isSectionEntirelyVisible(section) {
        const height = section.height();
        const y = section.offset().top - $(window).scrollTop();
        return y > 0 && y + height < $(window).height();
    }

    function isSectionEntirelyInvisible(section) {
        const top = section.offset().top - $(window).scrollTop();
        const bottom = top + section.outerHeight();
        return bottom < 0 || top > $(window).height();
    }

    $(window).on('scroll', function () {
        if (isSectionEntirelyVisible(section))
            sectionElements.addClass(animationClassName);
        if (isSectionEntirelyInvisible(section))
            sectionElements.removeClass(animationClassName);
    });

    // Share links

    function setShareLinkClickHandlers(shareLink, url) {
        shareLink.on('click', function (e) {
            e.preventDefault();
            window.open(url);
        });
    }

    function setShareLinks() {
        const url = encodeURIComponent(document.URL);
        const title = encodeURIComponent(document.title);
        const description = encodeURIComponent(
            $("meta[property='og:description']").attr('content')
        );

        setShareLinkClickHandlers(
            $('.social-network-link.vk'),
            `http://vk.com/share.php?url=${url}&title=${title}&description=${description}`
        );
        setShareLinkClickHandlers(
            $('.social-network-link.facebook'),
            `https://www.facebook.com/sharer.php?u=${url}`
        );
        setShareLinkClickHandlers(
            $('.social-network-link.twitter'),
            `https://twitter.com/intent/tweet?url=${url}&text=${
                title + encodeURIComponent('\n') + description
            }`
        );
    }

    setShareLinks();
});
