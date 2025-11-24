# -*- coding: utf-8 -*-
{
    'name': "Image Field Preview",
    'summary': "Image Field, Preview",
    'description': """This module supports enlarging the preview Image Field.""",
    'author': "Lucas<liusenyuan_09@163.com>",
    'website': "",
    'category': 'Technical',
    'version': '1.0',
    'depends': ['base', 'web'],
    'assets': {
        'web.assets_backend': [
            'image_preview/static/src/image_preview.xml',
            'image_preview/static/src/image_preview.js',
        ],
    },
    'images': [
        'static/description/screen_rec.gif',
    ],
    'installable': True,
    'auto_install': False,
    'license': 'LGPL-3',
}

