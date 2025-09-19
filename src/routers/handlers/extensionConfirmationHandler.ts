import { Request, Response } from "express";
import { BaseViewData, GenericHandler, ViewModel } from "./abstractGenericHandler";
import { logger } from "../../lib/logger";
import { PATHS, ROUTER_VIEWS_FOLDER_PATH } from "../../lib/constants";
import { getPscIndividual } from "../../services/pscIndividualService";

interface PscViewData extends BaseViewData {
    referenceNumber: string;
    companyName: string;
    companyNumber: string;
    pscName: string;
    dateOfBirth: string;
    dueDate: string;
}
export class ExtensionConfirmationHandler extends GenericHandler<PscViewData> {

    protected override async getViewData (req: Request, res: Response): Promise<PscViewData> {

        const baseViewData = await super.getViewData(req, res);
        // const idvDateFormatted = [idvDate.slice(0, 4), idvDate.slice(4, 6), idvDate.slice(6, 8)].join("-"); // yyyy-mm-dd
        const result = await getPscIndividual(req, "00006400", "PSCDATA5");
        const transactionId = req.params.transactionId;
        return {
            ...baseViewData,
            templateName: PATHS.EXTENSION_CONFIRMATION.slice(1),
            pscName: result.resource?.name!,
            referenceNumber: transactionId
            // dueDate: result.resource?.identityVerificationDetails?.appointmentVerificationStatementDueOn!
        };

    }

    public async executeGet (req: Request, res: Response): Promise<ViewModel<PscViewData>> {
        logger.info(`called to serve start page`);
        return {
            templatePath: ROUTER_VIEWS_FOLDER_PATH + PATHS.EXTENSION_CONFIRMATION,
            viewData: await this.getViewData(req, res)
        };
    }
}
