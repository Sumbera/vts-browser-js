/**
 * @constructor
 */
Melown.MapStats = function(map_) {
    this.map_ = map_;
    this.core_ = map_.core_;
    this.inspector_ = map_.core_.inspector_;
    this.drawnTiles_ = 0;
    this.counter_ = 0;
    this.statsCycle_ = 0;
    this.fps_ = 0;
    this.frameTime_ = 0;
    this.renderTime_ = 0;
    this.renderTimeTmp_ = 0;
    this.renderTimeBegin_ = 0;

    this.recordGraphs_ = false;
    this.graphsTimeIndex_ = 0;
    this.graphsLastTimeIndex_ = 0;
    this.graphsTimeSamples_ = 500;
    this.graphsRenderTimes_ = new Array(this.graphsTimeSamples_);
    this.graphsCreateMeshTimes_ = new Array(this.graphsTimeSamples_);
    this.graphsCreateGpuMeshTimes_ = new Array(this.graphsTimeSamples_);
    this.graphsCreateTextureTimes_ = new Array(this.graphsTimeSamples_);
    this.graphsFrameTimes_ = new Array(this.graphsTimeSamples_);
    this.graphsGpuMemory_ = new Array(this.graphsTimeSamples_);
    this.graphsGpuMemoryUsed_ = new Array(this.graphsTimeSamples_);
    this.graphsGpuMemoryTextures_ = new Array(this.graphsTimeSamples_);
    this.graphsGpuMemoryMeshes_ = new Array(this.graphsTimeSamples_);
    this.graphsPolygons_ = new Array(this.graphsTimeSamples_);
    this.graphsLODs_ = new Array(this.graphsTimeSamples_);
    this.graphsFluxTextures_ = new Array(this.graphsTimeSamples_);
    this.graphsFluxMeshes_ = new Array(this.graphsTimeSamples_);
    this.graphsFluxTexture_ = [[0,0],[0,0]];
    this.graphsFluxMesh_ = [[0,0],[0,0]];
    this.graphsCreateTextureTime_ = 0;
    this.graphsCreateGpuMeshTime_ = 0;
    this.graphsCreateMeshTime_ = 0;
    this.resetGraphs();

    this.gpuUsed_ = 0;
    this.resourcesUsed_ = 0;
    this.metaUsed_ = 0;

};

Melown.MapStats.prototype.resetGraphs = function() {
    this.graphsTimeIndex_ = 0;

    for (var i = 0; i < this.graphsTimeSamples_; i++) {
        this.graphsRenderTimes_[i] = 0;
        this.graphsCreateMeshTimes_[i] = 0;
        this.graphsCreateGpuMeshTimes_[i] = 0;
        this.graphsCreateTextureTimes_[i] = 0;
        this.graphsFrameTimes_[i] = 0;
        this.graphsGpuMemory_[i] = 0;
        this.graphsGpuMemoryUsed_[i] = 0;
        this.graphsGpuMemoryTextures_[i] = 0;
        this.graphsGpuMemoryMeshes_[i] = 0;
        this.graphsPolygons_[i] = 0;
        this.graphsLODs_[i] = [0,[]];
        this.graphsFluxTextures_[i] = [[0,0],[0,0]];
        this.graphsFluxMeshes_[i] = [[0,0],[0,0]];
    }
};

Melown.MapStats.prototype.begin = function() {
    this.drawnTiles_ = 0;
    this.counter_++;
    this.statsCycle_++;

    this.renderTimeBegin_ = performance.now();

};

Melown.MapStats.prototype.end = function() {

    var timer_ = performance.now();

    var renderTime_ = timer_ - this.renderTimeBegin_;
    var frameTime_ = timer_ - this.frameTime_;
    this.frameTime_ = timer_;
    this.renderTimeTmp_ += renderTime_;

    if (this.recordGraphs_) {
        var i = this.graphsTimeIndex_;

        this.graphsRenderTimes_[i] = renderTime_;
        this.graphsCreateMeshTimes_[i] = 0;
        this.graphsCreateGpuMeshTimes_[i] = 0;
        this.graphsCreateTextureTimes_[i] = 0;
        this.graphsFrameTimes_[i] = frameTime_;

        this.graphsTimeIndex_ = (this.graphsTimeIndex_ + 1) % this.graphsTimeSamples_;

        this.inspector_.updateGraphs(this);
    }


    if ((this.statsCycle_ % 100) == 0) {
        this.renderTime_ = this.renderTimeTmp_ / 100;
        this.fps_ = 1000 / this.renderTime_;
        this.renderTimeTmp_ = 0;

        if (this.inspector_ != null) {
            this.gpuUsed_ = this.map_.gpuCache_.totalCost_;
            this.resourcesUsed_ = this.map_.resourcesCache_.totalCost_;
            this.metaUsed_ = this.map_.metatileCache_.totalCost_;

            this.inspector_.updateStatsPanel(this);
        }
    }
};


