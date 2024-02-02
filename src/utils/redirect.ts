export const redirectPermanent = async (url: string) => {
  return {
    redirect: {
      destination: url,
      permanent: false,
    },
  }
}
