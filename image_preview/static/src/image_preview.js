/** @odoo-module */

import { ImageField, imageField } from "@web/views/fields/image/image_field";
import { loadJS, loadCSS} from "@web/core/assets";
import { patch } from "@web/core/utils/patch";
import { onWillStart } from "@odoo/owl";

/*
usage:
<field name="image_1920" widget="image" class="oe_avatar" options="{'preview_image': 'image_128'}"/>
If you want to disable downloading this image, please insert the following code into options in the Field tab.
<field ... options="{..., 'img_download': False}"
 */
const ImagePreview = {
    setup(){
        super.setup(...arguments);
        onWillStart(async () => {
            await loadJS("/image_preview/static/src/lib/jquery.fancybox.min.js")
            await loadCSS("/image_preview/static/src/lib/jquery.fancybox.min.css")
        })
    },
    get sizeStyle() {
        let style = super.sizeStyle;
        style += 'cursor: zoom-in;'
        return style;
    },
    getFancyboxGalleryOptions() {
        const options = {
            protect: true,  // Disable right-click and use simple image protection for images
            buttons: [
                "zoom",
                // "share",
                // "slideShow",
                "fullScreen",
                "thumbs",
                "close"
            ],
            lang: "zh_CN",
            i18n: {
                en: {
                    CLOSE: "Close",
                    NEXT: "Next",
                    PREV: "Previous",
                    ERROR: "The requested content cannot be loaded. <br/> Please try again later.",
                    PLAY_START: "Start slideshow",
                    PLAY_STOP: "Pause slideshow",
                    FULL_SCREEN: "Full screen",
                    THUMBS: "Thumbnails",
                    DOWNLOAD: "Download",
                    SHARE: "Share",
                    ZOOM: "Zoom"
                },
                zh_CN: {
                    CLOSE: "关闭",
                    NEXT: "下一个",
                    PREV: "上一个",
                    ERROR: "发生了错误，请稍后再试。",
                    PLAY_START: "开始幻灯片",
                    PLAY_STOP: "停止幻灯片",
                    FULL_SCREEN: "全屏",
                    THUMBS: "预览图片",
                    DOWNLOAD: "下载",
                    SHARE: "分享",
                    ZOOM: "变焦"
                }
            }
        }
        if (this.props.imgDownload) {
            options.buttons.splice(-1, 0, "download");
        }
        return options
    },
    onClickPreview(){
        const url = this.getUrl(this.props.name);
        const options = Object.assign({}, this.getFancyboxGalleryOptions(), {caption: "Image"});
        $.fancybox.open({
            src: url,
            type: 'image',
            opts: options
        });
    },
}

patch(ImageField.prototype, ImagePreview)

patch(ImageField, {
    props: {
        ...ImageField.props,
        imgDownload: {type: Boolean, optional: true},
    },
    defaultProps: {
        ...ImageField.defaultProps,
        imgDownload: true
    }
})

patch(imageField, {
    ...imageField,
    extractProps: ({ attrs, options }) => ({
        enableZoom: options.zoom,
        zoomDelay: options.zoom_delay,
        previewImage: options.preview_image,
        acceptedFileExtensions: options.accepted_file_extensions,
        width: options.size && Boolean(options.size[0]) ? options.size[0] : attrs.width,
        height: options.size && Boolean(options.size[1]) ? options.size[1] : attrs.height,
        reload: "reload" in options ? Boolean(options.reload) : true,
        imgDownload: options.img_download,    // Whether to allow image download
    }),
})