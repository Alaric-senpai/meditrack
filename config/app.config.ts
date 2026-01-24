export const appConfig = {
    url: process.env.NEXT_PUBLIC_URL!,
    environment: process.env.NODE_ENV,
    resendKey: process.env.RESEND_API_KEY!,
    resendDomain: process.env.RESEND_DOMAIN!,
    

}


export const authConfig = {
    success: appConfig.url + '/auth/success',
    failure: appConfig.url + '/auth/fail'


}