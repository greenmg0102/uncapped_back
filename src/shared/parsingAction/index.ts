import { GeneralReportLogic } from 'src/shared/parsingAction/GeneralReportLogic'
import { SqueezeReportLogic } from 'src/shared/parsingAction/SqueezeReportLogic'

export function ParsingAction(body: any) {

  if (!body.isSqueeze) return GeneralReportLogic(body)
  else return SqueezeReportLogic(body)
}