class MyCrop {
    constructor(params) {
        this.selector = params.selector;
        this.imgPath = params.imgPath;
        this.params = params;
        this.location = null;
        let self = this;
        $(this.selector).Jcrop({
            allowSelect: true,
            baseClass: 'my-crop',
            onSelect: this.onSelected.bind(this),
            onChange: this.onChange.bind(this),
            onRelease: this.onRelease.bind(this)
        }, function () {
            self.jcropApi = this;
        });
    }

    onChange() {

    }

    onSelected(e) {
        this.location = e;
        this.getBase64().then(res=>{
			console.log(res);
            let file = this.getFile(res);
            //window.open(URL.createObjectURL(file));
            this.params.onSuccess({base64: res, file: file});
        })
    }

    onRelease() {

    }
	
	setImage(imagePath) {
		this.jcropApi.setImage(imagePath, () => {
			this.imgPath = imagePath;
		});
	}

    getBase64() {
        return new Promise((resolve, reject) => {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            let image = new Image();
            let e = this.location;
            image.src = this.imgPath;
            image.setAttribute("crossOrigin",'anonymous');
            image.onload = function () {
                canvas.width = e.w;
                canvas.height = e.h;
                ctx.drawImage(image, e.x, e.y, e.w, e.h, 0, 0, e.w, e.h);
                let coverAfterBase64 = canvas.toDataURL('image/png');
                resolve(coverAfterBase64);
            }
        });
    }

    getFile(base64Data) {
        // base64转blob
        const base64ToBlob = function(base64Data) {
            let arr = base64Data.split(','),
                fileType = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                l = bstr.length,
                u8Arr = new Uint8Array(l);

            while (l--) {
                u8Arr[l] = bstr.charCodeAt(l);
            }
            return new Blob([u8Arr], {
                type: fileType
            });
        };
        // blob转file
        const blobToFile = function(newBlob, fileName) {
            newBlob.lastModifiedDate = new Date();
            newBlob.name = fileName;
            return newBlob;
        };

        // 调用
        const blob = base64ToBlob(base64Data);
        const file = blobToFile(blob, 'file');
        return file;
    }
}
