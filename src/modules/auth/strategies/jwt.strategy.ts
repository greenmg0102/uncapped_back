import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // secretOrKey: process.env.JWT_SECRET,
      secretOrKey: 'Glk09q7xsdiHeASQ',
      // secretOrKey: configService.get<string>('JWT_SECRET'),

      
    });
  }

  validate(payload: any) {
    return payload; // Returning the payload as the validated user object
  }
}