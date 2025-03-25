import { Dropbox } from 'dropbox';

const ACCESS_TOKEN = 'sl.u.AFkbDaoAqLfv4tASTr9dm8fts6HkHq3SuP5jS5XUnUv5jOCg-awWb6472cf-zOtm-lkzc6njGOE_XBWyB8vtLKN_klBS_4hohb879_5tdIaK44NK34bOpXk4Wps6Uxc88zQ4XDgkKk8ikPBa22Un9GZkFZ0LxBd-7gHUoXuGWoVarREZziH5xCHg_tPLHs22jqpoUHEium8cCiD51xBMiO7onb0ykvTs2aLxNAsKBwnmoG7OIaHYVmAqhVTQuwtz3PBl9VPPj7dj4oyfnEv0MbaF0jG66rnhUrvjoaPEejcLywuQkLRJwxv3QZl8vNxEy9TOZYIbWCTHuBW_xwJGg221La6zxianJmeHPMGN4bmrkEpT3MwcdGenQ3zbRP87tKbVnXcq453BYTWGiClUSau-6zDn5tGfNyuTqeyos4sFK0ERvZJ2IA7P0XKu3_IobeCkXT04kpF_GnXGizKccy0g_IFuLZff60eCnDror5zdEtzWuZEEymgsZBPWly3GxHj9g2WZ-4jOYHw3DQ4lKHCY6bRbNU4bIcvJKGHLagmQswGmQ5pJE5-Yi-SW0oomfZRrYqzGC9GIBw_7b0OOYsg4CldRPiTq_FnoqXaRFSiRHSLeonrO6BjS4Kqyhr3qZH-mtJ7vtp6uP-Hbaxv0cyErVBb9JFeGcwhSDGv8RgkGlO8kCmVKt63nvhqsMl3qpui07cnHvMc-_9Jl6NKvWJFpQfpuWFdCo5JW_c3CpHsvBfyh2VzNWcJnKscr7TU18UuV3FGowGic1fSvuNeESeYtOh0wrWHqZGv_8zuv9ASe6Xh-2LyrqDnH_1RWvRye-kl0F_MzUTXzLpFdooLL41v4nrAq54KLe5dIyoZN_KpnPU2fc61rF18pCKqAKkP2qLonb2Z32ePP5BGvRZsWFnhi5K2zcGya8Bt58W5BQRDMefEgnrlDsnH6HN7-ZgpidTlpUT8Wkn7DdpH8cd-aIDCdQQEEgbviwplixgUDnUG79eHqdlOYuEO2COZ90YB1WroLEDuLPSDHliulCyoxwHgntdXbY_f1xXTfy-H80wTbNZCptRX1peq3tZt0oSqJjcmh6uvfuzXDktZkpF516NJ19mtbzHtr2tGIIsfrIz4tsphDiaaexhd2A777S-BhX2bHUjcRfmTaJMAaivC7IxRwT9X6fQN6wCbr65FLPOeaj8tP_N_B37w29CndmWcOSZcT-nQ9CHMn9HZz6Ohp-_qjxv-PJ8ghBwTBqrfOnTCZFxgqDGwWySFCmQSxVV9oaEL7F4l1AKbFo-rDBHbR5bHJq2tfCVH_XNW1KwUAMUStAW5OmgbwQIscX2Vvb1EzYTFp0tSdaedfdTVS_j-CzPthSVx15zXgej3G2gKJpTqt0cluOF36JGIke0u_Lb8I9nPFRoEcns9Klmcyb-RpXGG7DMakN0SPIyx0ybnCKVEKjOYB_gbxOumyDp6UOZEY-2Y';

const dbx = new Dropbox({ accessToken: ACCESS_TOKEN });

export const uploadFileToDropbox = async (file: File): Promise<string> => {
  try {
    // Generate unique filename to avoid conflicts
    const uniqueFileName = `${Date.now()}_${file.name}`;
    const filePath = `/chatbot_uploads/${uniqueFileName}`;
    
    // Convert file to ArrayBuffer
    const fileBuffer = await file.arrayBuffer();

    // Upload file to Dropbox
    const uploadResponse = await dbx.filesUpload({
      path: filePath,
      contents: fileBuffer
    });

    try {
      // Try to create a shared link
      const sharedLinkResponse = await dbx.sharingCreateSharedLinkWithSettings({
        path: uploadResponse.result.path_display,
        settings: {
          requested_visibility: { '.tag': 'public' },
          audience: { '.tag': 'public' },
          access: { '.tag': 'viewer' }
        }
      });
      
      // Convert to direct download link
      return sharedLinkResponse.result.url.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
      
    } catch (shareError: any) {
      // If error is due to existing shared link, get the existing link
      if (shareError?.status === 409) {
        const existingLinksResponse = await dbx.sharingListSharedLinks({
          path: uploadResponse.result.path_display
        });
        
        if (existingLinksResponse.result.links.length > 0) {
          // Use the existing shared link
          const existingLink = existingLinksResponse.result.links[0].url;
          return existingLink.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
        }
      }
      throw shareError; // If it's not a conflict error or no existing links found
    }
  } catch (error) {
    console.error('Error uploading to Dropbox:', error);
    throw new Error('Failed to upload file to Dropbox');
  }
};

export const deleteFileFromDropbox = async (filePath: string): Promise<void> => {
  try {
    await dbx.filesDeleteV2({ path: filePath });
  } catch (error) {
    console.error('Error deleting from Dropbox:', error);
    throw new Error('Failed to delete file from Dropbox');
  }
};
