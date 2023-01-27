class NotFoundException extends BaseException {
    private code: number;
    private status: boolean
    constructor() {
        super()
    }
}