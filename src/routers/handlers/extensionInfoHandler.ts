import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./abstractGenericHandler";
import { logger } from "../../lib/logger";
import { SERVICE_PATH_PREFIX, PATHS, ROUTER_VIEWS_FOLDER_PATH } from "../../lib/constants";
import { getPscIndividual } from "../../services/pscIndividualService";
export class ExtensionInfoHandler extends GenericHandler<BaseViewData> {

    protected override async getViewData (req: Request, res: Response): Promise<BaseViewData> {
        const baseViewData = await super.getViewData(req, res);
        // may need to get companyNumber: string, pscNotificationId: string from req.params
        //  const { companyNumber, pscNotificationId } = req.params;
        console.log(res.locals?.companyProfile);
        // getPscIndividual request seems to work but its returning an error message
        // const result = await getPscIndividual(req, "companyNumber", "pscNotificationId");
        // console.log(result);
        return {
            ...baseViewData,
            //    comspanyNumber,
            backURL: SERVICE_PATH_PREFIX + PATHS.INDIVIDUAL_PSC_LIST,
            templateName: PATHS.EXTENSION_INFO.slice(1)
        };
    }

    public async executeGet (req: Request, res: Response): Promise<ViewModel<BaseViewData>> {
        logger.info(`called to serve start page`);
        return {
            templatePath: ROUTER_VIEWS_FOLDER_PATH + PATHS.EXTENSION_INFO,
            viewData: await this.getViewData(req, res)
        };
    }
}
