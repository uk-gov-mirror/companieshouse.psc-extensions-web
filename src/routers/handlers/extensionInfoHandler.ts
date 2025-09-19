import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./abstractGenericHandler";
import { logger } from "../../lib/logger";
import { SERVICE_PATH_PREFIX, PATHS, ROUTER_VIEWS_FOLDER_PATH } from "../../lib/constants";
import { getPscIndividual } from "../../services/pscIndividualService";

interface PscViewData extends BaseViewData {
    companyName: string;
    companyNumber: string;
    pscName: string;
    dateOfBirth: string;
}
export function formatDateBorn (dateOfBirth: any): string {
    try {
        const formattedMonth = Intl.DateTimeFormat(dateOfBirth, { month: "long" }).format(new Date("" + dateOfBirth?.month));
        const formattedYear = dateOfBirth?.year?.toString() ?? ""; // Default to an empty string if year is null or undefined
        return `${formattedMonth} ${formattedYear}`;
    } catch (error) {
        logger.error(`Error formatting date: ${error}`);
        return "Invalid date";
    }
}

export class ExtensionInfoHandler extends GenericHandler<PscViewData> {

    protected override async getViewData (req: Request, res: Response): Promise<PscViewData> {
        const baseViewData = await super.getViewData(req, res);
        // may need to get companyNumber: string, pscNotificationId: string from req.params
        //  const { companyNumber, pscNotificationId, companyName, pscName } = req.params;
        console.log(res.locals?.companyProfile);
        const result = await getPscIndividual(req, "00006400", "PSCDATA5");
        console.log(result);
        return {
            ...baseViewData,
            pscName: result.resource?.name!,
            dateOfBirth: formatDateBorn(result.resource?.dateOfBirth),
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
