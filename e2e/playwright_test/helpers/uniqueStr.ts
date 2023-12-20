    export function generateEmail(s: string) {
        const now = new Date().getTime();
        return `${s}` + `+` + `${now}` + `@gmail.com`;
    }

    export function generateText(length: number) {
        const now = new Date().getTime();
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }

    export function generateCode(length: number) {
        const now = new Date().getTime();
        let result = '';
        const characters = '0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }