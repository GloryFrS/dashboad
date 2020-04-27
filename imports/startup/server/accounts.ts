import { Accounts } from 'meteor/accounts-base'

Accounts.emailTemplates.from = `Noname.Team Dashboard Admin ${process.env.MAIL_ADMIN}`

Accounts.emailTemplates.verifyEmail = {
  subject () {
    return 'Activate your account now!'
  },
  text (user, url) {
    const urlWithoutHash = url.replace('#/', '')

    return `Hey ${user.username}! Verify your e-mail by following this link: ${urlWithoutHash}`
  }
}
