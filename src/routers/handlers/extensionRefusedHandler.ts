import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./abstractGenericHandler";
import { logger } from "../../lib/logger";
import { SERVICE_PATH_PREFIX, PATHS, ROUTER_VIEWS_FOLDER_PATH } from "../../lib/constants";
import { getPscIndividual } from "../../services/pscIndividualService";
import { formatDateBorn } from "./extensionInfoHandler";

interface PscViewData extends BaseViewData {
    referenceNumber: string;
    pscName: string;
    dateOfBirth: string;
}
export class ExtensionRefusedHandler extends GenericHandler<PscViewData> {

    protected override async getViewData (req: Request, res: Response): Promise<PscViewData> {
        const baseViewData = await super.getViewData(req, res);
        const result = await getPscIndividual(req, "00006400", "PSCDATA5");
        return {
            ...baseViewData,
            pscName: result.resource?.name!,
            dateOfBirth: formatDateBorn(result.resource?.dateOfBirth),
            // TODO: Add search params to backURL
            backURL: SERVICE_PATH_PREFIX + PATHS.INDIVIDUAL_PSC_LIST,
            templateName: PATHS.EXTENSION_REFUSED.slice(1)
        };
    }

    public async executeGet (req: Request, res: Response): Promise<ViewModel<PscViewData>> {
        logger.info(`called to serve start page`);
        return {
            templatePath: ROUTER_VIEWS_FOLDER_PATH + PATHS.EXTENSION_REFUSED,
            viewData: await this.getViewData(req, res)
        };
    }
}
