import { HttpInterceptorFn } from '@angular/common/http';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const modifiedReq = req.clone({
    setHeaders: {
      'X-App-Version': '1.0.0',
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJMODNvZW11Mks0M2NkU2pSS3lKWiIsIm5ldHdvcmtJZCI6Imlua29sbGR4IiwibmFtZSI6IkRlZXBhayIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3MTQ5NzA3MSwiZXhwIjoxNzcxNTAwNjcxfQ.NZuB1XX5s1C3Tnv8VwklRc3XWt8_2U--z92IW2tEXO4` 
    }
  });

  return next(modifiedReq);
};
