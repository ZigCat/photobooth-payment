import dslrApi from '../utils/dslrApi';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const startPhotoSession = async() => {
    try {
        console.log('Starting photo session');
        let res = await dslrApi.startPhotoSession();
        console.log('Photo session response:', res);
        console.log(res.IsSuccessful);
        if(res.IsSuccessful === true){
            console.log('Photo session started successfully');
            return { status: 'success' };
        } else {
            throw new Error('Photo session failed to start');
        }
        
    } catch (error) {
        console.error('Error starting photo session:', error);
        throw error;
    }
    // await delay(1000);
    // return { status: 'success' };
}

const printCopies = async(copies) => {
    try {
        console.log(`Printing ${copies} copies`);
        await dslrApi.printCopies(copies);
        return { status: 'success' };
    } catch (error) {
        console.error('Error printing copies:', error);
        throw error;
    }
    // await delay(1000);
    // return { status: 'success' };
}

export default {
    startPhotoSession,
    printCopies
};