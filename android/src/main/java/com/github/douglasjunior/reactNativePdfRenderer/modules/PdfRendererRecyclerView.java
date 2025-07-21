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
import android.util.Log;
import android.util.TypedValue;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.ScaleGestureDetector;
import android.view.ViewGroup;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.github.douglasjunior.reactNativePdfRenderer.BuildConfig;

import java.io.File;
import java.io.IOException;

@SuppressLint({"ViewConstructor", "NotifyDataSetChanged"})
public class PdfRendererRecyclerView extends RecyclerView {
    private final GestureDetector mGestureDetector;
    private final int mMinZoom = 1;
    private final ScaleGestureDetector mScaleDetector;
    private final Matrix mMatrix;
    private final ObservableZoom mZoomObserver;
    private final LayoutManager mLayoutManager;
    private final PdfRendererRecyclerViewListener mListener;
    private boolean mRequestedLayout = false;
    private float mMaxZoom = 5;
    private float mMaxPageResolution;
    private float mDistanceBetweenPages = 0;
    private int mWidth;
    private int mHeight;
    private int mCurrentItemPosition = -1;
    private boolean mSinglePage;

    public PdfRendererRecyclerView(@NonNull Context context, PdfRendererRecyclerViewListener listener) {
        super(context);

        mZoomObserver = new ObservableZoom(mMinZoom);

        mLayoutManager = new LayoutManager(context);
        mLayoutManager.setOrientation(LinearLayoutManager.VERTICAL);

        var adapter = new PdfRendererAdapter();

        this.setLayoutManager(mLayoutManager);
        this.setAdapter(adapter);
        this.addOnScrollListener(new OnScrollListener() {
            @Override
            public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                dispatchPageChangeEvent();
            }
        });

        mListener = listener;
        mMatrix = new Matrix();
        mScaleDetector = new ScaleGestureDetector(getContext(), new ScaleListener());
        mGestureDetector = new GestureDetector(context, new GestureListener());

        this.setLayoutParams(new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));
        this.setClipToOutline(true);
    }

    public void setDistanceBetweenPages(float distanceBetweenPages) {
        mDistanceBetweenPages = TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP,
                distanceBetweenPages,
                Resources.getSystem().getDisplayMetrics()
        );
    }

    public void setMaxPageResolution(float maxPageResolution) {
        this.mMaxPageResolution = maxPageResolution;
    }

    public void setMaxZoom(float maxZoom) {
        this.mMaxZoom = maxZoom;
    }

    private void dispatchPageChangeEvent() {
        var newPosition = mLayoutManager.findLastCompletelyVisibleItemPosition();
        if (newPosition < 0) newPosition = mLayoutManager.findLastVisibleItemPosition();

        if (newPosition != mCurrentItemPosition) {
            mCurrentItemPosition = newPosition;

            var adapter = (PdfRendererAdapter) getAdapter();
            if (adapter == null) return;

            mListener.onPageChange(this, newPosition, adapter.getItemCount());
        }
    }

    public void updateSource(File file) throws IOException {
        mCurrentItemPosition = -1;
        var adapter = (PdfRendererAdapter) getAdapter();
        if (adapter == null) return;
        adapter.close();
        adapter.updateSource(file);
        adapter.notifyDataSetChanged();
        post(this::dispatchPageChangeEvent);
    }

    @Override
    protected void dispatchDraw(@NonNull Canvas canvas) {
        canvas.save();
        canvas.concat(mMatrix);
        try {
            super.dispatchDraw(canvas);
        } catch (Exception ex) {
            Log.e("PdfRendererRecyclerView", "Error dispatching draw", ex);
        }
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
        var scale = mWidth > 0 && mHeight > 0
                ? Math.max(w / mWidth, h / mHeight)
                : 1;
        mMatrix.setScale(scale, scale);
        mMatrix.postTranslate((w - scale * mWidth) / 2f, (h - scale * mHeight) / 2f);
    }

    private boolean isScrollingInsideZoomedArea() {
        var values = new float[9];
        mMatrix.getValues(values);

        var scaleY = Math.min(Math.max(values[Matrix.MSCALE_Y], mMinZoom), mMaxZoom);
        var posY = values[Matrix.MTRANS_Y];

        var maxPosY = mHeight - mHeight * scaleY;

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
            Log.e("PdfRendererRecyclerView", "Error intercepting touch event", ex);
        }
        return false;
    }

    public void forceRequestLayout() {
        mRequestedLayout = false;
        requestLayout();
    }

    private void validateMatrixLimits() {
        var values = new float[9];
        mMatrix.getValues(values);

        var scaleX = Math.min(Math.max(values[Matrix.MSCALE_X], mMinZoom), mMaxZoom);
        var posX = values[Matrix.MTRANS_X];

        var scaleY = Math.min(Math.max(values[Matrix.MSCALE_Y], mMinZoom), mMaxZoom);
        var posY = values[Matrix.MTRANS_Y];

        var maxPosX = mWidth - mWidth * scaleX;
        var maxPosY = mHeight - mHeight * scaleY;

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
     * <a href="https://stackoverflow.com/a/49381907/2826279">Read more</a>
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
        if (mSinglePage) {
            resetZoom();
        }
    }

    private void resetZoom() {
        mMatrix.setScale(1, 1, 0, 0);
        validateMatrixLimits();
        postInvalidateOnAnimation();
        mZoomObserver.setZoom(1);
    }

    public interface PdfRendererRecyclerViewListener {
        void onPageChange(PdfRendererRecyclerView target, int position, int total);
    }

    private class ScaleListener extends ScaleGestureDetector.SimpleOnScaleGestureListener {
        @Override
        public boolean onScale(ScaleGestureDetector detector) {
            var values = new float[9];
            mMatrix.getValues(values);

            var zoom = values[Matrix.MSCALE_X];
            var factor = detector.getScaleFactor();

            if (zoom >= mMaxZoom && factor > 1) {
                return false;
            }

            mMatrix.postScale(factor, factor, getWidth() / 2f, getHeight() / 2f);
            validateMatrixLimits();
            postInvalidateOnAnimation();

            return true;
        }

        @Override
        public void onScaleEnd(@NonNull ScaleGestureDetector detector) {
            super.onScaleEnd(detector);

            var values = new float[9];
            mMatrix.getValues(values);
            var zoom = values[Matrix.MSCALE_X];

            mZoomObserver.setZoom(zoom);
        }
    }

    private class GestureListener extends GestureDetector.SimpleOnGestureListener {
        @Override
        public boolean onScroll(MotionEvent e1, @NonNull MotionEvent e2, float dX, float dY) {
            mMatrix.postTranslate(-dX, -dY);
            validateMatrixLimits();
            postInvalidateOnAnimation();
            return true;
        }

        @Override
        public boolean onDoubleTap(@NonNull MotionEvent e) {
            if (e.getPointerCount() > 1) {
                return false;
            }

            var values = new float[9];
            mMatrix.getValues(values);

            var currentZoom = values[Matrix.MSCALE_X];
            var newZoom = currentZoom > mMinZoom ? mMinZoom : mMaxZoom;
            var centerX = getWidth() / 2f;
            var centerY = getHeight() / 2f;

            mMatrix.setScale(newZoom, newZoom, centerX, centerY);
            mMatrix.postTranslate(centerX - e.getX(), centerY - e.getY());

            validateMatrixLimits();

            postInvalidateOnAnimation();

            mZoomObserver.setZoom(newZoom);
            return true;
        }
    }

    class PdfRendererAdapter extends Adapter<PdfRendererAdapter.ViewHolder> {
        private PdfRenderer mPdfRenderer;
        private ParcelFileDescriptor mFileDescriptor;

        public void updateSource(File file) throws IOException {
            mFileDescriptor = ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY);
            mPdfRenderer = new PdfRenderer(mFileDescriptor);
        }

        public void close() {
            if (mPdfRenderer != null) {
                mPdfRenderer.close();
                mPdfRenderer = null;
            }
            if (mFileDescriptor != null) {
                try {
                    mFileDescriptor.close();
                } catch (IOException e) {
                    if (BuildConfig.DEBUG) {
                        // noinspection CallToPrintStackTrace
                        e.printStackTrace();
                    }
                }
                mFileDescriptor = null;
            }

        }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            var imageView = new ImageView(parent.getContext());
            imageView.setScaleType(ImageView.ScaleType.FIT_CENTER);
            imageView.setBackgroundColor(Color.WHITE);
            var params = new LayoutParams(LayoutParams.MATCH_PARENT, 0);
            imageView.setLayoutParams(params);
            return new ViewHolder(imageView);
        }

        @Override
        public void onViewDetachedFromWindow(@NonNull ViewHolder holder) {
            super.onViewDetachedFromWindow(holder);
            holder.detachFromWindow();
        }

        @Override
        public void onViewAttachedToWindow(@NonNull ViewHolder holder) {
            super.onViewAttachedToWindow(holder);
            holder.attachFromWindow();
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            if (mPdfRenderer == null) return;
            holder.update(position, mZoomObserver.getZoom());
        }

        @Override
        public int getItemCount() {
            if (mPdfRenderer == null) return 0;
            if (mSinglePage) {
                return Math.min(mPdfRenderer.getPageCount(), 1);
            }
            return mPdfRenderer.getPageCount();
        }

        public class ViewHolder extends RecyclerView.ViewHolder {
            private ObservableZoom.ZoomChangeListener zoomListener;

            public ViewHolder(ImageView imageView) {
                super(imageView);
            }

            public ImageView getImageView() {
                return (ImageView) this.itemView;
            }

            private @NonNull Bitmap createBitmap(float newZoom, int pageWidth, int pageHeight) {
                // We need to take account of these points to avoid low quality image on large screen:
                // - target DPI resolution
                // - PDF print default resolution (72dpi)
                // see https://stackoverflow.com/a/32327174/2826279
                var scaledPageWidth = Math.round(getResources().getDisplayMetrics().densityDpi * pageWidth * newZoom / 72);
                var scaledPageHeight = Math.round(getResources().getDisplayMetrics().densityDpi * pageHeight * newZoom / 72);

                float scalingFactor = Math.min(
                        mMaxPageResolution / scaledPageWidth,
                        mMaxPageResolution / scaledPageHeight
                );

                float zoomFactor = Math.min(newZoom, scalingFactor);

                var bitmap = Bitmap.createBitmap(
                        Math.round(scaledPageWidth * zoomFactor),
                        Math.round(scaledPageHeight * zoomFactor),
                        Bitmap.Config.ARGB_8888
                );
                // Fill the bitmap with white color by default to prevent issues with transparent PDFs
                bitmap.eraseColor(Color.WHITE);
                return bitmap;
            }

            public void update(int position, float newZoom) {
                try (var page = mPdfRenderer.openPage(position)) {
                    var pageWidth = page.getWidth();
                    var pageHeight = page.getHeight();
                    var bitmap = createBitmap(newZoom, pageWidth, pageHeight);

                    page.render(bitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY);

                    var imageView = getImageView();
                    imageView.setImageBitmap(bitmap);

                    var lp = (LayoutParams) imageView.getLayoutParams();
                    lp.width = LayoutParams.MATCH_PARENT;

                    if (mSinglePage) {
                        lp.height = LayoutParams.MATCH_PARENT;
                        lp.setMargins(0, 0, 0, 0);
                    } else {
                        lp.height = Math.round(((float) mWidth / (float) pageWidth) * (float) pageHeight);
                        lp.setMargins(0, 0, 0, (int) mDistanceBetweenPages);
                    }
                    imageView.setLayoutParams(lp);
                } catch (Exception e) {
                    // Prevents the app from crashing if the adapter tries to render a page when the view is detached
                    // https://github.com/douglasjunior/react-native-pdf-renderer/issues/52
                    if (BuildConfig.DEBUG) {
                        // noinspection CallToPrintStackTrace
                        e.printStackTrace();
                    }
                }
            }

            public void detachFromWindow() {
                if (zoomListener != null) {
                    mZoomObserver.removeListener(zoomListener);
                    zoomListener = null;
                }
            }

            public void attachFromWindow() {
                detachFromWindow();
                zoomListener = newZoom -> {
                    var position = getLayoutPosition();
                    if (position == NO_POSITION) return;
                    if (position < mLayoutManager.findFirstVisibleItemPosition()
                            || position > mLayoutManager.findLastVisibleItemPosition()) return;
                    update(position, newZoom);
                };
                mZoomObserver.addListener(zoomListener);
            }
        }
    }

    class LayoutManager extends LinearLayoutManager {
        public LayoutManager(Context context) {
            super(context);
        }

        @Override
        public int scrollVerticallyBy(int dy, Recycler recycler, State state) {
            try {
                /*
                 * Reduces the scroll speed when zoomed
                 * https://github.com/douglasjunior/react-native-pdf-renderer/issues/3
                 */

                var values = new float[9];
                mMatrix.getValues(values);

                var scaleY = values[Matrix.MSCALE_Y];
                var dyWithScale = Math.round(dy / scaleY);

                return super.scrollVerticallyBy(dyWithScale, recycler, state);
            } catch (Exception e) {
                if (BuildConfig.DEBUG) {
                    // noinspection CallToPrintStackTrace
                    e.printStackTrace();
                }
                // Fallback to default behavior in case of an error
                // https://github.com/douglasjunior/react-native-pdf-renderer/issues/52
                return super.scrollVerticallyBy(dy, recycler, state);
            }
        }
    }
}
