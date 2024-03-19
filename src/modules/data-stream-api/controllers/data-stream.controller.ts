




import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  HttpCode,
  UseGuards,
  UsePipes,
  ValidationPipe,
  ParseFilePipe,
  FileTypeValidator,
  Req,
  HttpException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport'
import { FilesInterceptor } from '@nestjs/platform-express';
import { DetectorService } from '../../poker-room-detection/services/detector.service';
import { HandHistoryDataWriterService } from '../../database-storage/services/hand-history-data-writer.service';
import { RoomStrategyFactory } from '../../hand-history-parsing/factories/room-strategy.factory';
import { ParsedReturnData } from 'src/modules/hand-history-parsing/interfaces/parser.interface';
import { Readable } from 'stream';
import { RoomTypes } from 'src/common/constants/common.constants';
import { throwError } from 'rxjs';

@Controller('data-stream')
export class DataStreamController {
  constructor(
    private roomDetection: DetectorService,
    private readonly handModelService: HandHistoryDataWriterService,
    private readonly roomStrategyFactory: RoomStrategyFactory,
    private readonly roomType: RoomTypes,
  ) { }

@UseGuards(AuthGuard('jwt'))
@Post('/data-one')
@HttpCode(200)
// @UseInterceptors(FileInterceptor('file'))
@UseInterceptors(FilesInterceptor('file'))
@UsePipes(new ValidationPipe())
async receiveHistory(
  @UploadedFiles(
    new ParseFilePipe({
      validators: [new FileTypeValidator({ fileType: 'text/plain' })],
    }),
  )
    files: Express.Multer.File[],
  @Req() request: Request
) {
  try {
    let data: ParsedReturnData;

    for (const file of files) {
      const stream = new Readable();
      stream.push(file.buffer);
      stream.push(null);

      // const fileContent = file.buffer.toString();
      const fileContent = await this.readFileContent(stream);

      const sections: string[] = fileContent.split(/\n\s*(?:\n\s*){1,3}/);

      const roomType = this.roomDetection.identifyRoom(sections[0]);
      const strategyService = this.roomStrategyFactory.createStrategy(roomType);

      const user: any = request.user;
      const userId = user.sub._id;

      if (strategyService) {
        data = await strategyService.parse(sections);
        this.handModelService
          .saveHistory(data.data, roomType, userId)
          .then((res: any) => {
          })
          .catch((err: any) => {
            console.log(err);
          });
      }
    }
    // return data;
    return {
      status: 'success',
      msg: 'Successfully parsed',
    };
  } catch (e) {
    return {
      status: 'error',
      msg: e.toString(),
    };
  }
}

  private async readFileContent(stream: Readable): Promise < string > {
  return new Promise<string>((resolve, reject) => {
    let fileContent = '';
    stream.on('data', (chunk) => {
      fileContent += chunk.toString();
    });
    stream.on('end', () => {
      resolve(fileContent);
    });
    stream.on('error', (error) => {
      reject(error);
    });
  });
}

@UseGuards(AuthGuard('jwt'))
@Post('/data')
@HttpCode(200)
@UsePipes(new ValidationPipe())
async streamOne(@Req() request: Request) {

  try {
    const readableStream = request as unknown as Readable;
    const longStringPromise = new Promise<string>((resolve, reject) => {

      const chunks: Buffer[] = []; // Use Buffer instead of Uint8Array

      readableStream.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      readableStream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const longString = buffer.toString('utf8');
        resolve(longString);
      });

      readableStream.on('error', (error) => {
        reject(error);
      });

    });

    const longString = await longStringPromise;

    const files: string[] = longString.split(
      /\n\n\s+\*divition of file\*\s+\n\n/,
    );

    let wrongFiles = 0;
    let correctFiles = 0;
    let parsedFiles = 0;
    let notParsedFiles = 0;

    // let buffer = []

    for (const file of files) {
      const fileContent = file;
      const sections: string[] = fileContent.split(/\n\s*(?:\n\s*){1,3}/);

      const roomType = this.roomDetection.identifyRoom(sections[0]);

      if (roomType === this.roomType.noType) wrongFiles++;
      else correctFiles++;

      const strategyService = this.roomStrategyFactory.createStrategy(roomType);


      if (strategyService) {

        let data: ParsedReturnData = await strategyService.parse(sections);

        const user: any = request.user;
        const userId = user.sub._id;

        await this.handModelService
          .saveHistory(data.data, roomType, userId)
          .then((res: any) => {

            parsedFiles++;
            notParsedFiles = correctFiles - parsedFiles;
          })
          .catch((err: any) => {
            console.log(err);
          });
      }
    }

    if (correctFiles === 0) {
      return throwError(
        () => new HttpException('Require correct files', 400),
      );
    }

    return {
      status: 'success',
      message: 'Stream received successfully',
      correctFiles: correctFiles,
      wrongFiles: wrongFiles,
      parsedFiles: parsedFiles,
      notParsedFiles: notParsedFiles,
    };
  } catch (e) {
    return throwError(() => new HttpException(e.toString(), 400));
  }
}
}