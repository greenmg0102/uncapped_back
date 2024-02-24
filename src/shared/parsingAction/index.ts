import { GeneralReportLogic } from 'src/shared/parsingAction/GeneralReportLogic'
import { SqueezeReportLogic } from 'src/shared/parsingAction/SqueezeReportLogic'


export function ParsingAction(body: any) {
  return SqueezeReportLogic(body)
}