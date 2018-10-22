// https://gitlab.com/divramod/dm-tpl/issues/3

// IMPORT
import { UCommon } from '@utils/nodejs/common'
import { UJson } from '@utils/nodejs/json'

const PATH = require('path')

// TYPINGS
import {
    IResultMultiple,
    IResultOne,
    IResults,
} from '@utils/nodejs/common'

// CLASS
export class UTemplateUtility {

    public static getInstance(): UTemplateUtility {
        return UTemplateUtility.INSTANCE
    }

    private static INSTANCE: UTemplateUtility = new UTemplateUtility()
    public name: string = 'UTemplateUtility'

    constructor() {
        if (UTemplateUtility.INSTANCE) {
            throw new Error([
                'Error: Instantiation failed: Use',
                this.name,
                '.getInstance() instead of new.',
            ].join(' '))
        }
        UTemplateUtility.INSTANCE = this
    }

    public async isTemplateExistant(
        TEMPLATE_NAME: string,
    ): Promise<boolean> {

        // PREPARE
        let result

        // load templates from yagpt.config.json
        const YG_CONFIG_PATH = PATH.resolve(
            require('global-modules-path').getPath('yagpt'),
            'yagpt.config.json',
        )
        const TEMPLATES = UJson.getKeyValueFromFile(
            YG_CONFIG_PATH,
            'templates',
        ).value

        // proof if template name is existant
        if (TEMPLATES[TEMPLATE_NAME]) {
            result = true
        } else {
            result = false
        }

        // RETURN
        return result
    }

}
export const UTemplate = UTemplateUtility.getInstance()
