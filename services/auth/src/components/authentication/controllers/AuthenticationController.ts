import { Request, Response } from 'express';

import { createResponse } from '../../../handlers/ResponseHandler';
import { SignUp } from '../interfaces/SignUp';
import { AuthenticationService } from '../services/AuthenticationService';

export class AuthenticationController {
  private authenticationService: AuthenticationService;
  constructor() {
    this.authenticationService = new AuthenticationService();
  }

  public signUp = async (req: Request, res: Response): Promise<void> => {
    const accountData: SignUp = req.body;
    const { status, data } = await createResponse(this.authenticationService.signUp(accountData));

    res.status(status).json(data);
  };
}
