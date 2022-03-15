# -*- coding: utf-8 -*-
from odoo import fields, models


class SmsGateway(models.Model):

    _name = "sms.gateway"
    
    name = fields.Char(required=True, string='Gateway Name')
    gateway_model_name = fields.Char(required='True',
                                     string='Gateway Model Name')