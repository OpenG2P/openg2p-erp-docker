# -*- coding: utf-8 -*-
#################################################################################
# Author      : Kanak Infosystems LLP. (<http://kanakinfosystems.com/>)
# Copyright(c): 2012-Present Kanak Infosystems LLP.
# All Rights Reserved.
#
#
# This program is copyright property of the author mentioned above.
# You can`t redistribute it and/or modify it.
#
#
# You should have received a copy of the License along with this program.
# If not, see <http://kanakinfosystems.com/license>
#################################################################################

{
    'name': 'Remove Export Option',
    'description': 'Remove the \'Export\' option from the \'More\' menu...',
    'version': '1.0',
    'summary': 'A useful module which allows removal of export option easily using the access rights and permissions from the user Settings',
    'license': 'OPL-1',
    'author': 'Kanak Infosystems LLP.',
    'website': 'http://www.kanakinfosystems.com',
    'images': ['static/description/main_screenshot.png'],
    'category': 'Web',
    'description': """

Remove the 'Export' option from the 'More' menu using hide group...
in the list view except for the admin user

""",
    'depends': ['web'],
    'data': [
        'security/export_visible_security.xml',
        'view/disable_export_view.xml',
    ],
    'auto_install': False,
}
