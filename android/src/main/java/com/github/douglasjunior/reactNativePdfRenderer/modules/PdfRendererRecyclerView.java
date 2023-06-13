// MIT License

// Copyright (c) 2023 Douglas Nassif Roma Junior

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

package com.github.douglasjunior.reactNativePdfRenderer.modules;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.pdf.PdfRenderer;
import android.os.ParcelFileDescriptor;
import android.util.TypedValue;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.ScaleGestureDetector;
import android.view.ViewGroup;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.core.view.ViewCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.io.File;
import java.io.IOException;

public class PdfRendererRecyclerView extends RecyclerView {
    private final ViewGroup mParent;
    private final GestureDetector mGestureDetector;
    private boolean mRequestedLayout = false;
    private float mMinZoom = 1;
    private float mMaxZoom = 5;
    private float mDistanceBetweenPages = 0;
    private int mWidth;
    private int mHeight;
    private int mCurrentItemPosition = -1;
    private ReactApplicationContext mReactApplicationContext;
    private ScaleGestureDetector mScaleDetector;
    private Matrix mMatrix;
    private boolean mSinglePage;

    public PdfRendererRecyclerView(@NonNull ReactApplicationContext context, ViewGroup parent) {
        super(context);

        LayoutManager lm = new LayoutManager(context);
        lm.setOrientation(LinearLayoutManager.VERTICAL);

        PdfRendererAdapter adapter = new PdfRendererAdapter();

        this.setLayoutManager(lm);
        this.setAdapter(adapter);
        this.addOnScrollListener(new ScrollListener());

        mReactApplicationContext = context;
        mParent = parent;
        mMatrix = new Matrix();
        mScaleDetector = new ScaleGestureDetector(getContext(), new ScaleListener());
        mGestureDetector = new GestureDetector(context, new GestureListener());
    }

    public void setDistanceBetweenPages(float distanceBetweenPages) {
        mDistanceBetweenPages = TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP,
                distanceBetweenPages,
                Resources.getSystem().getDisplayMetrics()
        );
    }

    public void setMaxZoom(float maxZoom) {
        this.mMaxZoom = maxZoom;
    }

    public void closeAdapter() {
        try {
            PdfRendererAdapter adapter = (PdfRendererAdapter) getAdapter();
            adapter.close();
            adapter.notifyDataSetChanged();
        } catch (Exception ex) {
            ex.printStackTrace();
            // do nothing
        }
    }

    public void updateSource(String source) throws IOException {
        mCurrentItemPosition = -1;
        PdfRendererAdapter adapter = (PdfRendererAdapter) getAdapter();
        adapter.updateSource(source);
        adapter.notifyDataSetChanged();
        dispatchPageChangeEvent();
    }

    private void dispatchPageChangeEvent() {
        int position = ((LinearLayoutManager) getLayoutManager()).findLastCompletelyVisibleItemPosition();

        if (position < 0) {
            position = ((LinearLayoutManager) getLayoutManager()).findLastVisibleItemPosition();
        }

        if (position != mCurrentItemPosition) {
            mCurrentItemPosition = position;

            PdfRendererAdapter adapter = (PdfRendererAdapter) getAdapter();

            WritableMap event = Arguments.createMap();
            event.putInt("position", position);
            event.putInt("total", adapter.getPageCount());

            mReactApplicationContext
                    .getJSModule(RCTEventEmitter.class)
                    .receiveEvent(mParent.getId(), "pageChange", event);
        }
    }

    @Override
    protected void dispatchDraw(@NonNull Canvas canvas) {
        canvas.save();
        canvas.concat(mMatrix);
        super.dispatchDraw(canvas);
        canvas.restore();
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        mWidth = MeasureSpec.getSize(widthMeasureSpec);
        mHeight = MeasureSpec.getSize(heightMeasureSpec);
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        float scale = mWidth > 0 && mHeight > 0
                ? Math.max(w / mWidth, h / mHeight)
                : 1;
        mMatrix.setScale(scale, scale);
        mMatrix.postTranslate((w - scale * mWidth) / 2f, (h - scale * mHeight) / 2f);
    }

    private boolean isScrollingInsideZoomedArea() {
        float[] values = new float[9];
        mMatrix.getValues(values);

        float scaleY = Math.min(Math.max(values[Matrix.MSCALE_Y], mMinZoom), mMaxZoom);
        float posY = values[Matrix.MTRANS_Y];

        float maxPosY = mHeight - mHeight * scaleY;

        return posY < 0 && posY > maxPosY;
    }

    @Override
    @SuppressLint("ClickableViewAccessibility")
    public boolean onTouchEvent(MotionEvent e) {
        mScaleDetector.onTouchEvent(e);
        mGestureDetector.onTouchEvent(e);

        /*
         * Disables the RecyclerView scroll when scrolling inside zoomed area
         * https://github.com/douglasjunior/react-native-pdf-renderer/issues/3
         */
        if (isScrollingInsideZoomedArea()) {
            return true;
        }

        return super.onTouchEvent(e);
    }

    @Override
    public boolean onInterceptTouchEvent(MotionEvent ev) {
        try {
            return super.onInterceptTouchEvent(ev);
        } catch (IllegalArgumentException ex) {
            ex.printStackTrace();
        }
        return false;
    }

    public void forceRequestLayout() {
        mRequestedLayout = false;
        requestLayout();
    }

    private void validateMatrixLimits() {
        float[] values = new float[9];
        mMatrix.getValues(values);

        float scaleX = Math.min(Math.max(values[Matrix.MSCALE_X], mMinZoom), mMaxZoom);
        float posX = values[Matrix.MTRANS_X];

        float scaleY = Math.min(Math.max(values[Matrix.MSCALE_Y], mMinZoom), mMaxZoom);
        float posY = values[Matrix.MTRANS_Y];

        float maxPosX = mWidth - mWidth * scaleX;
        float maxPosY = mHeight - mHeight * scaleY;

        if (posX > 0.0f)
            posX = 0.0f;
        else if (posX < maxPosX)
            posX = maxPosX;

        if (posY > 0.0f)
            posY = 0.0f;
        else if (posY < maxPosY)
            posY = maxPosY;

        values[Matrix.MSCALE_X] = scaleX;
        values[Matrix.MTRANS_X] = posX;
        values[Matrix.MSCALE_Y] = scaleY;
        values[Matrix.MTRANS_Y] = posY;

        mMatrix.setValues(values);
    }

    /**
     * Fix a problem with React Native layout
     * https://stackoverflow.com/a/49381907/2826279
     */
    @SuppressLint("WrongCall")
    @Override
    public void requestLayout() {
        super.requestLayout();
        if (!mRequestedLayout) {
            mRequestedLayout = true;
            this.post(() -> {
                onLayout(false, getLeft(), getTop(), getRight(), getBottom());
            });
        }
    }

    public void setSinglePage(boolean singlePage) {
        this.mSinglePage = singlePage;
    }

    private class ScaleListener extends ScaleGestureDetector.SimpleOnScaleGestureListener {
        @Override
        public boolean onScale(ScaleGestureDetector detector) {
            float[] values = new float[9];
            mMatrix.getValues(values);

            float zoom = values[Matrix.MSCALE_X];
            float factor = detector.getScaleFactor();

            if (zoom >= mMaxZoom && factor > 1) {
                return false;
            }

            mMatrix.postScale(factor, factor, getWidth() / 2f, getHeight() / 2f);
            validateMatrixLimits();
            ViewCompat.postInvalidateOnAnimation(PdfRendererRecyclerView.this);
            return true;
        }
    }

    private class GestureListener extends GestureDetector.SimpleOnGestureListener {
        @Override
        public boolean onScroll(MotionEvent e1, MotionEvent e2, float dX, float dY) {
            mMatrix.postTranslate(-dX, -dY);
            validateMatrixLimits();
            ViewCompat.postInvalidateOnAnimation(PdfRendererRecyclerView.this);
            return true;
        }

        @Override
        public boolean onDoubleTap(@NonNull MotionEvent e) {
            if (e.getPointerCount() > 1) {
                return false;
            }

            float[] values = new float[9];
            mMatrix.getValues(values);

            float currentZoom = values[Matrix.MSCALE_X];
            float newZoom = currentZoom > mMinZoom ? mMinZoom : mMaxZoom;
            float centerX = getWidth() / 2f;
            float centerY = getHeight() / 2f;

            mMatrix.setScale(newZoom, newZoom, centerX, centerY);
            mMatrix.postTranslate(centerX - e.getX(), centerY - e.getY());

            validateMatrixLimits();

            ViewCompat.postInvalidateOnAnimation(PdfRendererRecyclerView.this);
            return true;
        }
    }

    class PdfRendererAdapter extends Adapter<PdfRendererAdapter.ViewHolder> {

        private ParcelFileDescriptor mFileDescriptor;
        private PdfRenderer mPdfRenderer;

        public void updateSource(String source) throws IOException {
            if (source == null || source.isEmpty()) return;
            File file = new File(source.replace("file://", ""));
            mFileDescriptor = ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY);
            mPdfRenderer = new PdfRenderer(mFileDescriptor);
        }

        public void close() throws IOException {
            mPdfRenderer.close();
            mFileDescriptor.close();
            mPdfRenderer = null;
            mFileDescriptor = null;
        }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            ImageView imageView = new ImageView(parent.getContext());
            imageView.setScaleType(ImageView.ScaleType.FIT_CENTER);
            imageView.setBackgroundColor(Color.WHITE);
            LayoutParams params = new LayoutParams(LayoutParams.MATCH_PARENT, 0);
            imageView.setLayoutParams(params);
            ViewHolder viewHolder = new ViewHolder(parent, imageView);
            return viewHolder;
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            if (mPdfRenderer == null) return;

            PdfRenderer.Page page = mPdfRenderer.openPage(position);
            Bitmap bitmap = Bitmap.createBitmap(page.getWidth(), page.getHeight(), Bitmap.Config.ARGB_4444);
            page.render(bitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY);

            ImageView imageView = holder.getImageView();
            imageView.setImageBitmap(bitmap);

            LayoutParams lp = (LayoutParams) imageView.getLayoutParams();
            lp.width = LayoutParams.MATCH_PARENT;

            if (mSinglePage) {
                lp.height = LayoutParams.MATCH_PARENT;
                lp.setMargins(0, 0, 0, 0);
            } else {
                lp.height = Math.round(((float) mWidth / (float) page.getWidth()) * (float) page.getHeight());
                lp.setMargins(0, 0, 0, (int) mDistanceBetweenPages);
            }

            imageView.setLayoutParams(lp);

            page.close();
        }

        @Override
        public int getItemCount() {
            if (mPdfRenderer == null) return 0;
            if (mSinglePage) {
                return Math.min(mPdfRenderer.getPageCount(), 1);
            }
            return mPdfRenderer.getPageCount();
        }

        public int getPageCount() {
            if (mPdfRenderer == null) return 0;
            return mPdfRenderer.getPageCount();
        }

        public class ViewHolder extends RecyclerView.ViewHolder {

            private final ViewGroup mParentView;

            public ViewHolder(ViewGroup parentView, ImageView imageView) {
                super(imageView);
                mParentView = parentView;
            }

            public ViewGroup getParentView() {
                return mParentView;
            }

            public ImageView getImageView() {
                return (ImageView) this.itemView;
            }
        }
    }

    class ScrollListener extends OnScrollListener {

        @Override
        public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
            dispatchPageChangeEvent();
        }
    }

    class LayoutManager extends LinearLayoutManager {
        public LayoutManager(Context context) {
            super(context);
        }

        @Override
        public int scrollVerticallyBy(int dy, Recycler recycler, State state) {
            /*
             * Reduces the scroll speed when zoomed
             * https://github.com/douglasjunior/react-native-pdf-renderer/issues/3
             */

            float[] values = new float[9];
            mMatrix.getValues(values);

            float scaleY = values[Matrix.MSCALE_Y];

            int dyWithScale = Math.round(dy / scaleY);

            return super.scrollVerticallyBy(dyWithScale, recycler, state);
        }
    }
}
